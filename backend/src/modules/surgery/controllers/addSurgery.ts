import { Request, Response } from "express";
import {
	affiliationRepo,
	departmentRepo,
	surgeryLogsRepo,
	surgeryRepo,
	userRepo,
	roleRepo,
	surgeryEquipmentRepo,
} from "../../../config/repositories.js";
import { PatientDetails } from "../../../entity/sub entity/PatientDetails.js";
import { addSurgerySchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { AppDataSource } from "../../../config/data-source.js";
import { In } from "typeorm";
import { DoctorsTeam } from "../../../entity/sub entity/DoctorsTeam.js";
import { Surgery } from "../../../entity/sql/Surgery.js";
import { SurgeryLog } from "../../../entity/mongodb/SurgeryLog.js";
import {
	surgeryAuthService,
	trainingService,
} from "../../../config/initializeServices.js";

export const addSurgery = async (req: Request, res: Response) => {
	const validation = addSurgerySchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const {
		hospitalId,
		departmentId,
		name,
		leadSurgeon,
		slots,
		doctorsTeam,
		surgeryEquipments,
		date,
		time,
		cptCode,
		icdCode,
		patientBmi,
		patientComorbidity,
		patientDiagnosis,
	} = validation.data;
	let surgery: Surgery;
	let surgeryLog: SurgeryLog;

	try {
		const [hospital, department, leadSurgeonEntity] = await Promise.all([
			affiliationRepo.findOneBy({ id: hospitalId }),
			departmentRepo.findOneBy({ id: departmentId }),
			userRepo.findOne({
				where: { id: leadSurgeon },
				relations: ["role"],
			}),
		]);

		if (!hospital) throw new Error("Hospital Not Found");
		if (!department) throw new Error("Department Not Found");
		if (!leadSurgeonEntity?.role)
			throw new Error("Lead surgeon role Not Found");

		// Validate team members
		const doctorIds = doctorsTeam.map((p) => p.doctorId);
		const roleIds = doctorsTeam.map((p) => p.roleId);

		const [existingUsers, existingRoles] = await Promise.all([
			userRepo.findBy({ id: In(doctorIds) }),
			roleRepo.findBy({ id: In(roleIds) }),
		]);

		if (existingUsers.length !== doctorsTeam.length)
			throw new Error(`Invalid doctors`);

		if (existingRoles.length !== new Set(roleIds).size)
			throw new Error(`Invalid roles`);

		const surgeryEquipmentsArray = await Promise.all(
			surgeryEquipments.map(async (equipment) => {
				const equip = await surgeryEquipmentRepo.findOneBy({ id: equipment });
				if (!equip) throw Error(`Invalid equipment ID: ${equipment}`);

				return equip;
			})
		);

		if (slots < doctorIds.length) {
			res.status(400).json({
				success: false,
				message: `Surgery slots is ${slots} can not have ${doctorIds.length} doctors`,
			});
			return;
		}

		await AppDataSource.transaction(async (transactionalEntityManager) => {
			// Create SQL surgery
			surgery = transactionalEntityManager.create(Surgery, {
				department,
				hospital,
				lead_surgeon: leadSurgeonEntity,
				name,
				surgeryEquipments: surgeryEquipmentsArray,
			});

			await transactionalEntityManager.save(surgery);

			// Create MongoDB surgery log
			const patient = new PatientDetails(
				patientBmi,
				patientComorbidity,
				patientDiagnosis
			);

			surgeryLog = new SurgeryLog();
			surgeryLog.surgeryId = surgery.id;
			surgeryLog.doctorsTeam = doctorsTeam.map((doctor) => {
				return new DoctorsTeam(
					doctor.doctorId,
					doctor.roleId,
					doctor.participationStatus,
					doctor.notes
				);
			});
			surgeryLog.leadSurgeon = leadSurgeonEntity.id;
			surgeryLog.date = new Date(date);
			surgeryLog.time = time;
			surgeryLog.cptCode = cptCode;
			surgeryLog.icdCode = icdCode;
			surgeryLog.patient_details = patient;

			// Initialize training records
			surgeryLog.trainingCredits =
				await trainingService.initializeSurgeryRecords(
					surgery.id,
					doctorsTeam.map((d) => ({
						userId: d.doctorId,
						roleId: d.roleId,
					}))
				);

			await surgeryLogsRepo.save(surgeryLog);
		});

		res.status(201).json({
			success: true,
			message: "Surgery created successfully",
			data: {
				surgeryId: surgery.id,
				logId: surgeryLog.id,
				participantCount: doctorsTeam.length,
				leadSurgeon: {
					id: leadSurgeonEntity.id,
					name: `${leadSurgeonEntity.first_name} ${leadSurgeonEntity.last_name}`,
				},
			},
		});
	} catch (error) {
		// Cleanup on failure
		if (surgery?.id) await surgeryRepo.delete(surgery.id);
		if (surgeryLog?.id) await surgeryLogsRepo.delete(surgeryLog.id);

		res.status(400).json({
			success: false,
			message: error.message,
			errorDetails: error.stack?.split("\n")[0],
		});
	}
};
