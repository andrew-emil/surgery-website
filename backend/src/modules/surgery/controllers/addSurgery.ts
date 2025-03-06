import { Request, Response } from "express";
import {
	affiliationRepo,
	surgeryLogsRepo,
	surgeryRepo,
	surgeryTypeRepo,
} from "../../../config/repositories.js";
import { PatientDetails } from "../../../entity/sub entity/PatientDetails.js";
import { addSurgerySchema } from "../../../utils/zodSchemas.js";

export const addSurgery = async (req: Request, res: Response) => {
	const validation = addSurgerySchema.safeParse(req.body);

	if (!validation.success) {
		const errorMessages = validation.error.issues
			.map((issue) => `${issue.path.join(".")} - ${issue.message}`)
			.join(", ");

		throw Error(errorMessages);
	}

	const {
		hospitalId,
		surgeryTypeId,
		performedBy,
		date,
		time,
		surgicalTimeMinutes,
		cptCode,
		icdCode,
		patientBmi,
		patientComorbidity,
		patientDiagnosis,
	} = validation.data;

	const hospital = await affiliationRepo.findOneBy({
		id: parseInt(hospitalId),
	});

	if (!hospital) throw Error("Hospital not found");

	const surgeryTypeDetails = await surgeryTypeRepo.findOneBy({
		id: parseInt(surgeryTypeId),
	});

	if (!surgeryTypeDetails) throw Error("Surgery type not found");

	const surgery = surgeryRepo.create({
		surgery_type: surgeryTypeDetails,
		hospital,
	});

	await surgeryRepo.save(surgery);

	const patient = new PatientDetails(
		patientBmi,
		patientComorbidity,
		patientDiagnosis
	);

	const surgeryLog = surgeryLogsRepo.create({
		surgeryId: surgery.id,
		performedBy,
		date: new Date(date),
		time,
		surgicalTimeMinutes: surgicalTimeMinutes || null,
		cptCode,
		icdCode,
		patient_details: patient,
	});

	await surgeryLogsRepo.save(surgeryLog);

	res.status(201).json({
		success: true,
		message: "Surgery created successfully",
	});
};
