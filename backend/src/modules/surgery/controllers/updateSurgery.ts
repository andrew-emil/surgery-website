import { Request, Response } from "express";
import { updateSurgerySchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { surgeryLogsRepo } from "../../../config/repositories.js";
import { AppDataSource } from "../../../config/data-source.js";
import { Surgery } from "../../../entity/sql/Surgery.js";
import { In } from "typeorm";
import { Affiliations } from "./../../../entity/sql/Affiliations.js";
import { Department } from "../../../entity/sql/departments.js";
import { SurgeryEquipment } from "../../../entity/sql/SurgeryEquipments.js";
import { notificationService } from "../../../config/initializeServices.js";
import { NOTIFICATION_TYPES } from "../../../utils/dataTypes.js";
import { DoctorsTeam } from "../../../entity/sub entity/DoctorsTeam.js";

export const updateSurgery = async (req: Request, res: Response) => {
	const validation = updateSurgerySchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const {
		surgeryId,
		hospitalId,
		departmentId,
		surgeryEquipments,
		doctorsTeam,
		...updateData
	} = validation.data;

	const updatedSurgery = await AppDataSource.transaction(async (sqlManager) => {
		const surgery = await sqlManager.findOne(Surgery, {
			where: { id: surgeryId },
			relations: ["department", "hospital", "surgeryEquipments"],
			lock: { mode: "pessimistic_write" },
		});

		if (!surgery) throw new Error("Surgery not found");

		if (hospitalId) {
			const hospital = await sqlManager.findOne(Affiliations, {
				where: { id: hospitalId },
			});
			if (!hospital) throw new Error("Hospital not found");
			surgery.hospital = hospital;
		}

		// Update department relationship
		if (departmentId) {
			const department = await sqlManager.findOne(Department, {
				where: { id: departmentId },
			});
			if (!department) throw new Error("Department not found");
			surgery.department = department;
		}

		if (surgeryEquipments) {
			const equipment = await sqlManager.find(SurgeryEquipment, {
				where: {
					id: In(surgeryEquipments),
				},
			});
			if (equipment.length !== surgeryEquipments.length) {
				throw new Error("One or more equipment items not found");
			}
			surgery.surgeryEquipments = equipment;
		}

		// Merge and save changes
		const mergedSurgery = sqlManager.merge(Surgery, surgery, updateData);
		return await sqlManager.save(mergedSurgery);
	});

	const changeTimestamp = new Date();
	const scheduleUpdated = Boolean(updateData.date || updateData.time);

	const previousLog = await surgeryLogsRepo.findOne({
		where: { surgeryId: updatedSurgery.id },
	});
	const previousDoctorsTeam: string[] =
		previousLog && previousLog.doctorsTeam
			? previousLog.doctorsTeam.map((doc) => doc.doctorId)
			: [];

	const logUpdate = {
		surgeryId: updatedSurgery.id,
		...updateData,
		...(doctorsTeam ? { doctorsTeam } : {}),
		updatedAt: changeTimestamp,
		updatedBy: req.user?.name || "system",
	};

	await surgeryLogsRepo.updateOne(
		{ surgeryId: updatedSurgery.id },
		{ $set: logUpdate },
		{ upsert: true }
	);

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
			if (previousDoctorsTeam.includes(doctor.doctorId)) {
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
					`Surgery: ${updatedSurgery.name} schedule updated to ${formattedSchedule}`
				)
			)
		);

		// Notify newly assigned doctors that they have been added to the surgery with the new schedule
		await Promise.all(
			newAssigned.map((doctorId) =>
				notificationService.createNotification(
					doctorId,
					NOTIFICATION_TYPES.INVITE,
					`You have been assigned to Surgery: ${updatedSurgery.name} scheduled on ${formattedSchedule}<br>
					Please review the surgery and contact the Consultant for any questions`
				)
			)
		);
	}

	res.status(200).json({
		success: true,
		message: "Surgery updated successfully",
	});
};
