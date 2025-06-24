import { Request, Response } from "express";
import { postSurgeryRepo } from "../../../config/repositories.js";
import { getSuccessRatesPipeline } from "../../../utils/pipelines.js";

export const getSuccessRates = async (req: Request, res: Response) => {
	const pipeline = getSuccessRatesPipeline();
	const aggregatedData: any[] = await postSurgeryRepo
		.aggregate(pipeline)
		.toArray();

	const formattedData = aggregatedData.map((item) => ({
		date: item.date,
		successRate: Number(item.successRate.toFixed(2)),
		totalSurgeries: item.totalSurgeries,
		successfulSurgeries: item.successfulSurgeries,
		failedSurgeries: item.failedSurgeries,
	}));

	res.status(200).json({
		success: true,
		data: formattedData,
	});
};
