import { Request, Response } from "express";
import { addPostSurgerySchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { postSurgeryRepo, surgeryRepo } from "../../../config/repositories.js";
import { DISCHARGE_STATUS, OUTCOME } from "../../../utils/dataTypes.js";

export const addPostSurgery = async (req: Request, res: Response) => {
	const validation = addPostSurgerySchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const {
		surgeryId,
		surgicalTimeMinutes,
		outcome,
		complications,
		dischargeStatus,
		caseNotes,
	} = validation.data;

	const parsedSurgeryId = parseInt(surgeryId);
	if (isNaN(parsedSurgeryId)) throw Error("Invalid Surgery ID");

	const surgeryMinutes = parseInt(surgicalTimeMinutes);
	if (isNaN(surgeryMinutes)) throw Error("Invalid surgical time minutes");

	const surgery = await surgeryRepo.findOneBy({
		id: parsedSurgeryId,
	});
	if (!surgery) throw Error("Surgery Not Found");

	const existingPostSurgery = await postSurgeryRepo.findOneBy({
		surgeryId: parsedSurgeryId,
	});
	if (existingPostSurgery) {
		res.status(409).json({
			success: false,
			message: "Post-surgery record already exists",
		});
		return;
	}

	if (!Object.values(OUTCOME).includes(outcome as OUTCOME))
		throw Error("Invalid outcome value");

	if (
		!Object.values(DISCHARGE_STATUS).includes(
			dischargeStatus as DISCHARGE_STATUS
		)
	)
		throw Error("Invalid discharge status value");

	const postSurgery = postSurgeryRepo.create({
		surgeryId: parsedSurgeryId,
		surgicalTimeMinutes: surgeryMinutes,
		outcome: outcome as OUTCOME,
		complications: complications?.trim() || null,
		dischargeStatus: dischargeStatus as DISCHARGE_STATUS,
		caseNotes: caseNotes?.trim() || null,
	});

	await postSurgeryRepo.save(postSurgery);

	res.status(201).json({
		success: true,
		message: "Surgery details added successfully",
	});
};
