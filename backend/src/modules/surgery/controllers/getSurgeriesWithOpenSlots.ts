import { Request, Response } from "express";
import { STATUS } from "../../../utils/dataTypes.js";
import { surgeryLogsRepo, surgeryRepo } from "../../../config/repositories.js";
import { In } from "typeorm";

export const getSurgeriesWithOpenSlots = async (
	req: Request,
	res: Response
) => {
	const pipeline = [
		{
			$match: {
				status: STATUS.ONGOING,
				doctorsTeam: { $exists: true, $ne: [] }, // Ensure doctorsTeam exists and isn't empty
			},
		},
		{
			$addFields: {
				doctorsTeamCount: { $size: "$doctorsTeam" },
			},
		},
		{
			$match: {
				$expr: { $lt: ["$slots", "$doctorsTeamCount"] },
			},
		},
		{
			$project: {
				doctorsTeamCount: 0, // Remove temporary field from results
			},
		},
	];
	const openSurgeries = await surgeryLogsRepo.aggregate(pipeline).toArray();

	if (openSurgeries.length === 0) {
		res.status(200).json({
			success: true,
			surgeries: [],
			total: 0,
			message: "No surgeries with open slots found.",
		});
		return;
	}

	const surgeryIds = openSurgeries.map((log) => log.surgeryId);

	const [surgeryMetaData, total] = await surgeryRepo.findAndCount({
		where: {
			id: In(surgeryIds),
		},
		relations: ["department", "hospital"],
		select: ["id", "name", "hospital", "department"],
	});

	if (surgeryMetaData.length !== openSurgeries.length) {
		res.status(404).json({
			success: false,
			message: "Some MetaData are invalid",
			data: openSurgeries,
		});
		return;
	}

	const surgeryMetaMap = surgeryMetaData.reduce((map, meta) => {
		map[meta.id] = meta;
		return map;
	}, {} as Record<number, (typeof surgeryMetaData)[0]>);

	const surgeriesResponse = openSurgeries.map((log) => {
		const meta = surgeryMetaMap[log.surgeryId];
		const assignedCount = log.doctorsTeam ? log.doctorsTeam.length : 0;
		const openSlots = log.slots - assignedCount;
		return {
			id: log.surgeryId,
			surgeryName: meta?.name,
			availableSlot: `${openSlots} available (${assignedCount}/${log.slots})`,
			hospital: meta?.hospital.name,
			department: meta?.department.name,
		};
	});

	res.status(200).json({
		success: true,
		surgeries: surgeriesResponse,
		total,
	});
};
