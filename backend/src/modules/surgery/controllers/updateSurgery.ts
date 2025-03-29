import { Request, Response } from "express";
import { updateSurgerySchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import {
	procedureTypeRepo,
	requirementRepo,
	surgeryLogsRepo,
} from "../../../config/repositories.js";
import { AppDataSource } from "../../../config/data-source.js";
import { Surgery } from "../../../entity/sql/Surgery.js";
import { In } from "typeorm";
import { SurgeryEquipment } from "../../../entity/sql/SurgeryEquipments.js";
import {
	notificationService,
	trainingService,
} from "../../../config/initializeServices.js";
import { NOTIFICATION_TYPES } from "../../../utils/dataTypes.js";
import { ProcedureType } from "../../../entity/sql/ProcedureType.js";

export const updateSurgery = async (req: Request, res: Response) => {
	const validation = updateSurgerySchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const { surgeryId, procedureTypeId, doctorsTeam, ...updateData } =
		validation.data;

	const queryRunner = AppDataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		const surgery = await queryRunner.manager.findOne(Surgery, {
			where: { id: surgeryId },
			relations: ["procedure", "department", "hospital", "surgeryEquipments"],
			lock: { mode: "pessimistic_write" },
		});

		if (!surgery) throw new Error("Surgery record not found");

		const { surgeryEquipments, ...updateDataWithoutRelations } = updateData;

		if (surgeryEquipments) {
			const equipment = await queryRunner.manager.find(SurgeryEquipment, {
				where: { id: In(surgeryEquipments) },
			});

			if (equipment.length !== surgeryEquipments.length) {
				throw new Error("One or more equipment items not found");
			}

			surgery.surgeryEquipments = equipment;
		}

		const mergedSurgery = queryRunner.manager.merge(
			Surgery,
			surgery,
			updateDataWithoutRelations
		);

		await queryRunner.manager.save(mergedSurgery);

		let oldProcedureType: ProcedureType | null = null;
		if (procedureTypeId && surgery.procedure?.id !== procedureTypeId) {
			const newProcedureType = await procedureTypeRepo.findOne({
				where: { id: procedureTypeId },
				relations: ["category"],
			});
			if (!newProcedureType) throw new Error("Invalid procedure type");

			oldProcedureType = surgery.procedure;
			surgery.procedure = newProcedureType;
		}

		if (doctorsTeam && surgery.procedure) {
			const roleRequirements = await requirementRepo.find({
				where: {
					role: { id: In(doctorsTeam.map((t) => t.roleId)) },
					procedure: { id: surgery.procedure.id },
				},
			});

			const invalidRoles = doctorsTeam.filter((t) => {
				const req = roleRequirements.find((r) => r.role.id === t.roleId);
				return (
					!req ||
					req.procedure.category.code !== surgery.procedure.category.code
				);
			});

			if (invalidRoles.length > 0) {
				res.status(400).json({
					success: false,
					message:
						"Some team member roles are not qualified for this procedure type",
				});
				return;
			}
		}

		const previousLog = await surgeryLogsRepo.findOne({
			where: {
				surgeryId: { $eq: surgeryId },
			},
		});
		const previousDoctors = previousLog?.doctorsTeam || [];

		if (doctorsTeam || procedureTypeId) {
			const currentDoctorIds =
				doctorsTeam?.map((d) => d.doctorId) ||
				previousLog.doctorsTeam.map((d) => d.doctorId);
			const previousDoctorIds = previousDoctors.map((d) => d.doctorId);

			if (surgery.procedure) {
				const addedDoctors = currentDoctorIds.filter(
					(id) => !previousDoctorIds.includes(id)
				);
				const removedDoctors = previousDoctorIds.filter(
					(id) => !currentDoctorIds.includes(id)
				);

				if (oldProcedureType) {
					await trainingService.adjustProgress(
						queryRunner,
						currentDoctorIds,
						oldProcedureType,
						-1
					);
				}

				await trainingService.adjustProgress(
					queryRunner,
					currentDoctorIds,
					surgery.procedure,
					1
				);

				await trainingService.adjustProgress(
					queryRunner,
					removedDoctors,
					surgery.procedure,
					-1
				);
			}
		}
		const scheduleUpdated = Boolean(updateData.date || updateData.time);

		const logUpdate = { ...updateData, updatedAt: new Date() };
		await surgeryLogsRepo.updateOne(
			{ surgeryId },
			{ $set: logUpdate },
			{ upsert: true }
		);

		await queryRunner.commitTransaction();

		if (scheduleUpdated && doctorsTeam) {
			const newDate = updateData.date || previousLog.date;
			const newTime = updateData.time || previousLog.time;
			const scheduleDateTime = new Date(`${newDate} ${newTime}`);
			const formattedSchedule = scheduleDateTime.toLocaleString("en-US", {
				dateStyle: "medium",
				timeStyle: "short",
			});

			const updatedAssigned: string[] = [];
			const newAssigned: string[] = [];

			doctorsTeam.forEach((doctor: { doctorId: string }) => {
				if (doctor.doctorId.includes(doctor.doctorId)) {
					updatedAssigned.push(doctor.doctorId);
				} else {
					newAssigned.push(doctor.doctorId);
				}
			});

			await Promise.all(
				updatedAssigned.map((doctorId) =>
					notificationService.createNotification(
						doctorId,
						NOTIFICATION_TYPES.SCHEDULE_UPDATE,
						`Surgery: ${mergedSurgery.name} schedule updated to ${formattedSchedule}<br>
						Hospital: ${mergedSurgery.hospital.name}`
					)
				)
			);

			// Notify newly assigned doctors that they have been added to the surgery with the new schedule
			await Promise.all(
				newAssigned.map((doctorId) =>
					notificationService.createNotification(
						doctorId,
						NOTIFICATION_TYPES.INVITE,
						`You have been assigned to Surgery: ${mergedSurgery.name} scheduled on ${formattedSchedule}<br>
						Hospital: ${mergedSurgery.hospital.name}<br>
						Please review the surgery and contact the Consultant for any questions`
					)
				)
			);
		}

		res.status(200).json({
			success: true,
			message: "Surgery details updated successfully",
		});
	} catch (error) {
		await queryRunner.rollbackTransaction();
		res.status(500).json({
			success: false,
			message:
				error instanceof Error
					? error.message
					: "Failed to update surgery due to an unexpected error",
		});
	} finally {
		await queryRunner.release();
	}
};
