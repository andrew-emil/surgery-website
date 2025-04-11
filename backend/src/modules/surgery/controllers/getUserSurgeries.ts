import { Request, Response } from "express";
import { surgeryLogsRepo } from "../../../config/repositories.js";
import { formatService } from "./../../../config/initializeServices.js";

export const getUserSurgeries = async (req: Request, res: Response) => {
	if (!req.user) throw Error("unauthorized");
	const userId = req.user.id;

	const surgeries = await surgeryLogsRepo.find({
		where: {
			$or: [{ "doctorsTeam.doctorId": userId }, { leadSurgeon: userId }],
		},
		select: [
			"id",
			"surgeryId",
			"doctorsTeam",
			"leadSurgeon",
			"icdCode",
			"cptCode",
			"date",
			"time",
		],
	});

	if (surgeries.length === 0) {
		throw Error("No Surgeries was found");
	}

	const formatedSurgeries = await formatService.formatSurgeries(surgeries);

	res.status(200).json({
		surgeries: formatedSurgeries,
	});
};
