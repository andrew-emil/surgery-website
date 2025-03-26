import { Request, Response } from "express";
import { addPostSurgerySchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import {
	postSurgeryRepo,
	surgeryRepo,
	surgeryLogsRepo,
	authenticationRequestRepo,
} from "../../../config/repositories.js";
import { Authentication_Request } from "../../../utils/dataTypes.js";
import { trainingService } from "../../../config/initializeServices.js";

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

	const [surgery, surgeryLog] = await Promise.all([
		surgeryRepo.findOne({
			where: { id: surgeryId },
			relations: ["leadSurgeon"],
		}),
		surgeryLogsRepo.findOneBy({ surgeryId }),
	]);

	if (!surgery || !surgeryLog) {
		res.status(404).json({
			success: false,
			message: "Surgery record not found in system",
		});
		return;
	}

	const existingPostSurgery = await postSurgeryRepo.findOneBy({
		surgeryId,
	});
	if (existingPostSurgery) {
		res.status(409).json({
			success: false,
			message: "Post-surgery record already exists",
		});
		return;
	}

	const postSurgery = postSurgeryRepo.create({
		surgeryId,
		surgicalTimeMinutes,
		outcome,
		complications: complications?.trim() || null,
		dischargeStatus,
		caseNotes: caseNotes?.trim() || null,
	});

	await Promise.all([
		postSurgeryRepo.save(postSurgery),
		trainingService.handleSurgeryCompletion(surgeryId),
		authenticationRequestRepo.update(
			{ surgery: { id: surgeryId } },
			{ status: Authentication_Request.APPROVED }
		),
	]);

	res.status(201).json({
		success: true,
		message: "Surgery details added and training records updated",
		data: {
			postSurgeryId: postSurgery.id,
			surgeryDetails: {
				id: surgery.id,
				name: surgery.name,
				duration: postSurgery.surgicalTimeMinutes,
				outcome: postSurgery.outcome,
			},
			trainingUpdated: surgeryLog.doctorsTeam.length,
		},
	});
};
