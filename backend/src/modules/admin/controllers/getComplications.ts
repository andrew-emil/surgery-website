import { Request, Response } from "express";
import { postSurgeryRepo } from "../../../config/repositories.js";
import { OUTCOME } from "../../../utils/dataTypes.js";

export const getComplications = async (req: Request, res: Response) => {
	// Build match stage
	const matchStage: any = {
		complications: { $exists: true, $ne: null, $not: /^\s*$/ },
	};

	const analysis = (await postSurgeryRepo
		.aggregate([
			{ $match: matchStage },
			{
				$addFields: {
					complicationsArray: {
						$filter: {
							input: {
								$map: {
									input: { $split: ["$complications", ","] },
									in: { $trim: { input: "$$this" } },
								},
							},
							as: "comp",
							cond: {
								$and: [
									{ $ne: ["$$comp", ""] },
									{ $ne: [{ $toLower: "$$comp" }, "none"] },
								],
							},
						},
					},
				},
			},
			{ $unwind: "$complicationsArray" },
			{
				$group: {
					_id: {
						dischargeStatus: "$dischargeStatus",
						complication: { $toLower: "$complicationsArray" },
					},
					totalCases: { $sum: 1 },
					avgDuration: { $avg: "$surgicalTimeMinutes" },
					outcomes: {
						$push: {
							$cond: [
								{ $eq: ["$outcome", OUTCOME.SUCCESS] },
								"success",
								"failure",
							],
						},
					},
				},
			},
			{
				$group: {
					_id: "$_id.dischargeStatus",
					complications: {
						$push: {
							complication: "$_id.complication",
							count: "$totalCases",
							successRate: {
								$divide: [
									{
										$size: {
											$filter: {
												input: "$outcomes",
												as: "o",
												cond: { $eq: ["$$o", "success"] },
											},
										},
									},
									{ $size: "$outcomes" },
								],
							},
							avgDuration: "$avgDuration",
						},
					},
					totalComplications: { $sum: "$totalCases" },
				},
			},
			{
				$project: {
					dischargeStatus: "$_id",
					totalComplications: 1,
					complications: {
						$slice: [
							{
								$sortArray: {
									input: "$complications",
									sortBy: { count: -1 },
								},
							},
							10,
						],
					},
					_id: 0,
				},
			},
			{ $sort: { dischargeStatus: 1 } },
		])
		.toArray()) as any[];

	res.status(200).json({
		analysis,
		analyzedRecords: analysis.reduce(
			(sum, item) => sum + item.totalComplications,
			0
		),
	});
};
