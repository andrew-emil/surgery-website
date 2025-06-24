import { OUTCOME } from "./dataTypes.js";

export function getComplicationsPipeline() {
	return [
		{
			$match: {
				complications: { $exists: true, $ne: null, $not: /^\s*$/ },
				createdAt: { $exists: true, $ne: null },
			},
		},
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
				monthYear: {
					$dateToString: {
						format: "%Y-%m",
						date: "$createdAt",
					},
				},
			},
		},
		{ $unwind: "$complicationsArray" },
		{
			$group: {
				_id: {
					date: "$monthYear",
					complication: { $toLower: "$complicationsArray" },
					dischargeStatus: "$dischargeStatus",
				},
				totalCases: { $sum: 1 },
				successfulCases: {
					$sum: {
						$cond: [{ $eq: ["$outcome", OUTCOME.SUCCESS] }, 1, 0],
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				date: "$_id.date",
				complication: "$_id.complication",
				dischargeStatus: "$_id.dischargeStatus",
				count: "$totalCases",
				successRate: {
					$round: [
						{
							$multiply: [
								{ $divide: ["$successfulCases", "$totalCases"] },
								100,
							],
						},
						2,
					],
				},
			},
		},
		{ $sort: { date: 1 } },
	];
}

export function getSuccessRatesPipeline() {
	return [
		{
			$match: {
				createdAt: { $exists: true, $ne: null },
			},
		},
		{
			$group: {
				_id: {
					year: { $year: "$createdAt" },
					month: { $month: "$createdAt" },
				},
				totalSurgeries: { $sum: 1 },
				successfulSurgeries: {
					$sum: {
						$cond: [{ $eq: ["$outcome", OUTCOME.SUCCESS] }, 1, 0],
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				date: {
					$dateToString: {
						format: "%Y-%m",
						date: {
							$dateFromParts: {
								year: "$_id.year",
								month: "$_id.month",
								day: 1,
							},
						},
					},
				},
				totalSurgeries: 1,
				successfulSurgeries: 1,
				successRate: {
					$multiply: [
						{ $divide: ["$successfulSurgeries", "$totalSurgeries"] },
						100,
					],
				},
			},
		},
		{ $sort: { date: 1 } },
	];
}

export function getTeamPerformancePipeline(userIds: any[]) {
	return [
		{
			$match: {
				$or: [
					{ leadSurgeon: { $in: userIds } },
					{ "doctorsTeam.doctorId": { $in: userIds } },
				],
			},
		},
		{
			$lookup: {
				from: "rating",
				localField: "surgeryId",
				foreignField: "surgeryId",
				as: "ratings",
			},
		},
		{ $unwind: "$ratings" },
		{
			$project: {
				involvedUsers: {
					$concatArrays: [["$leadSurgeon"], "$doctorsTeam.doctorId"],
				},
				stars: "$ratings.stars",
			},
		},
		{ $unwind: "$involvedUsers" },
		{
			$group: {
				_id: "$involvedUsers",
				avgRating: { $avg: "$stars" },
			},
		},
	];
}
