import { Request, Response } from "express";
import { postSurgeryRepo } from "../../../config/repositories.js";
import { getComplicationsPipeline } from "../../../utils/pipelines.js";

export const getComplications = async (req: Request, res: Response) => {
	const pipeline = getComplicationsPipeline();
	const timeSeriesData: any[] = await postSurgeryRepo
		.aggregate(pipeline)
		.toArray();

	const summary = {
		totalComplications: timeSeriesData.reduce(
			(sum, item) => sum + item.count,
			0
		),
		uniqueComplications: [
			...new Set(timeSeriesData.map((item) => item.complication)),
		].length,
	};

	res.status(200).json({
		success: true,
		data: {
			timeSeries: timeSeriesData,
			summary,
		},
	});
};
