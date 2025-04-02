import { Request, Response } from "express";
import { postSurgeryRepo } from "../../../config/repositories.js";
import { OUTCOME } from "../../../utils/dataTypes.js";

export const getSuccessRates = async (req: Request, res: Response) => {
	const [total, totalSuccess] = await Promise.all([
		postSurgeryRepo.count(),
		postSurgeryRepo.count({
			outcome: { $eq: OUTCOME.SUCCESS },
		}),
	]);

	// Calculate success rate
	let rate = 0;
	if (total > 0) {
		rate = (totalSuccess / total) * 100;
	}

	res.status(200).json({
		success: true,
		data: {
			successRate: Number(rate.toFixed(2)),
			totalSurgeries: total,
			successfulSurgeries: totalSuccess,
			failedSurgeries: total - totalSuccess,
		},
	});
};
