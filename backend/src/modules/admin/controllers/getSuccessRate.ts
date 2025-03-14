import { Request, Response } from "express";
import { postSurgeryRepo } from "../../../config/repositories.js";
import { OUTCOME } from "../../../utils/dataTypes.js";

export const getSuccessRate = async (req: Request, res: Response) => {
	const totalSurgeries = await postSurgeryRepo.count();

	const successfulSurgeries = await postSurgeryRepo.countBy({
		outcome: { $eq: OUTCOME.SUCCESS } as any,
	});

	const successRate =
		totalSurgeries > 0 ? (successfulSurgeries / totalSurgeries) * 100 : 0;

	res.status(200).json({
		success: true,
		successRate,
		successfulSurgeries,
		totalSurgeries,
	});
};
