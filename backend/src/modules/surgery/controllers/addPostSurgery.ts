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
import { AppDataSource } from "../../../config/data-source.js";

export const addPostSurgery = async (req: Request, res: Response) => {
	const validation = addPostSurgerySchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const { surgeryId, ...postData } = validation.data;
	const queryRunner = AppDataSource.createQueryRunner();

	try {
		await queryRunner.connect();
		await queryRunner.startTransaction();

		// Verify surgery existence
		const [surgery, surgeryLog] = await Promise.all([
			surgeryRepo.findOne({ where: { id: surgeryId } }),
			surgeryLogsRepo.findOneBy({ surgeryId }),
		]);

		if (!surgery || !surgeryLog) {
			const missing = [];
			if (!surgery) missing.push("surgery");
			if (!surgeryLog) missing.push("surgery log");
			res.status(404).json({
				success: false,
				message: `Surgery records not found: Missing ${missing.join(" and ")}`,
			});
			return;
		}

		// Check for existing post-surgery record
		const existingPost = await postSurgeryRepo.findOneBy({ surgeryId });
		if (existingPost) {
			res.status(409).json({
				success: false,
				message:
					"Post-surgery documentation already completed for this procedure",
				documentationId: existingPost.id,
			});
			return;
		}

		// Create and save post-surgery record
		const postSurgery = postSurgeryRepo.create({
			...postData,
			complications: postData.complications?.trim() || null,
			caseNotes: postData.caseNotes?.trim() || null,
			surgeryId,
		});

		// Execute all updates in transaction
		await Promise.all([
			queryRunner.manager.save(postSurgery),
			trainingService.handleSurgeryCompletion(surgeryId),
			authenticationRequestRepo.update(
				{ surgery: { id: surgeryId } },
				{ status: Authentication_Request.APPROVED }
			),
		]);

		await queryRunner.commitTransaction();

		res.status(201).json({
			success: true,
			message: "Post-operative documentation completed successfully",
			documentation: {
				id: postSurgery.id,
				surgeryId: surgery.id,
				procedureName: surgery.name,
				duration: postSurgery.surgicalTimeMinutes,
				outcome: postSurgery.outcome,
				dischargeStatus: postSurgery.dischargeStatus,
				recordedAt: new Date().toISOString(),
			},
			participants: {
				total: surgeryLog.doctorsTeam.length,
				credited: surgeryLog.trainingCredits.filter((d) => d.verified).length,
			},
		});
	} catch (error) {
		await queryRunner.rollbackTransaction();
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to complete post-surgery documentation";

		res.status(500).json({
			success: false,
			message: errorMessage,
			errorCode: "POST_OP_DOCUMENTATION_FAILURE",
			referenceId: surgeryId,
		});
	} finally {
		await queryRunner.release();
	}
};
