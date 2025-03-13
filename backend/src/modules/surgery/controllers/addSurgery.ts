import { Request, Response } from "express";
import {
	affiliationRepo,
	surgeryLogsRepo,
	surgeryRepo,
	surgeryTypeRepo,
	userRepo,
} from "../../../config/repositories.js";
import { PatientDetails } from "../../../entity/sub entity/PatientDetails.js";
import { addSurgerySchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { AppDataSource } from "../../../config/data-source.js";
import { In } from "typeorm";
import { DoctorsTeam } from "../../../entity/sub entity/DoctorsTeam.js";
import { Surgery } from "../../../entity/sql/Surgery.js";
import { SurgeryLog } from "../../../entity/mongodb/SurgeryLog.js";

export const addSurgery = async (req: Request, res: Response) => {
	const validation = addSurgerySchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const {
		hospitalId,
		surgeryTypeId,
		leadSurgeon,
		doctorsTeam,
		date,
		time,
		cptCode,
		icdCode,
		patientBmi,
		patientComorbidity,
		patientDiagnosis,
	} = validation.data;

	const hospital = await affiliationRepo.findOneBy({
		id: parseInt(hospitalId),
	});
	if (!hospital) throw Error("Hospital Not Found");

	const surgeryTypeDetails = await surgeryTypeRepo.findOneBy({
		id: parseInt(surgeryTypeId),
	});
	if (!surgeryTypeDetails) throw Error("Surgery type Not Found");

	const leadSurgeonEntity = await userRepo.findOneBy({
		id: leadSurgeon,
	})
	if(!leadSurgeonEntity) throw Error("Lead Surgeon Not Found")

	const doctorIds = doctorsTeam.map((p) => p.doctorId);
	const doctors = await userRepo.findBy({ id: In(doctorIds) });
	if (doctors.length !== doctorsTeam.length)
		throw Error("One or more doctors Not Found");

	let surgery: Surgery;

	await AppDataSource.transaction(async (transactionalEntityManager) => {
		surgery = transactionalEntityManager.create(surgeryRepo.target, {
			surgery_type: surgeryTypeDetails,
			hospital,
		});
		await transactionalEntityManager.save(surgeryRepo.target, surgery);
	});

	try {
		const patient = new PatientDetails(
			patientBmi,
			patientComorbidity,
			patientDiagnosis
		);

		const surgeryLog = new SurgeryLog();
		surgeryLog.surgeryId = surgery.id;
		if (doctorsTeam.length > 0) {
			surgeryLog.doctorsTeam = doctorsTeam.map((doctor) => {
				const permissions = doctor.permissions.map((perm) => parseInt(perm));
				const teamMember = new DoctorsTeam(
					doctor.doctorId,
					parseInt(doctor.roleId),
					permissions,
					doctor.participationStatus,
					doctor.notes
				);
				return teamMember;
			});
		}
		surgeryLog.leadSurgeon = leadSurgeonEntity.id;
		surgeryLog.date = new Date(date);
		surgeryLog.time = time;
		surgeryLog.cptCode = cptCode;
		surgeryLog.icdCode = icdCode;
		surgeryLog.patient_details = patient;

		await surgeryLogsRepo.save(surgeryLog);
	} catch (error) {
		await surgeryRepo.delete(surgery.id);
		throw Error("Failed to save surgery log. Rolling back surgery creation.");
	}

	res.status(201).json({
		success: true,
		message: "Surgery created successfully",
	});
};
