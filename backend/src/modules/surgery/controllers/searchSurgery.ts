import { Request, Response } from "express";
import { surgeryLogsRepo, userRepo } from "../../../config/repositories.js";
import { ILike } from "typeorm";
import { formatService } from "../../../config/initializeServices.js";

export const searchSurgery = async (req: Request, res: Response) => {
	const {
		cptCode,
		icdCode,
		date,
		participant,
		page = "1",
		limit = "10",
	} = req.query;
	const query: any = {};

	if (cptCode) query.cptCode = { $regex: new RegExp(cptCode.toString(), "i") };

	if (icdCode) query.icdCode = { $regex: new RegExp(icdCode.toString(), "i") };

	if (date) {
		const parsedDate = new Date(date.toString());
		if (isNaN(parsedDate.getTime())) throw Error("Invalid date parameter");
		query.date = parsedDate;
	}

	if (participant) {
		const participantStr = participant.toString().trim();
		const nameParts = participantStr.split(" ").filter(Boolean);

		let doctorQuery: any;
		if (nameParts.length === 1) {
			doctorQuery = [{ first_name: ILike(`%${nameParts[0]}%`) }];
		} else if (nameParts.length >= 2) {
			doctorQuery = {
				first_name: ILike(`%${nameParts[0]}%`),
				last_name: ILike(`%${nameParts[1]}%`),
			};
		}
		const doctors = await userRepo.find({ where: doctorQuery });
		const doctorIds = doctors.map((doc) => doc.id);

		if (doctorIds.length === 0) {
			res.status(200).json({ success: true, surgeries: [] });
			return;
		}
		query["doctorsTeam.doctorId"] = { $in: doctorIds };
		query.leadSurgeon = { $in: doctorIds };
	}

	const pageNumber = Math.max(1, parseInt(page.toString(), 10));
	const limitNumber = Math.min(
		100,
		Math.max(1, parseInt(limit.toString(), 10))
	);
	const skip = (pageNumber - 1) * limitNumber;

	const [surgeries, totalRecords] = await surgeryLogsRepo.findAndCount({
		where: query,
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
		order: { date: "DESC", time: "DESC" },
		take: limitNumber,
		skip,
	});
	const totalPages = Math.ceil(totalRecords / limitNumber);

	if (surgeries.length === 0) {
		res.status(200).json({
			success: true,
			surgeries: [],
			pagination: {
				currentPage: pageNumber,
				pageSize: limitNumber,
				totalRecords,
				totalPages,
			},
		});
		return;
	}

	const formatedSurgeries = await formatService.formatSurgeries(surgeries);

	res.status(200).json({
		success: true,
		surgeries: formatedSurgeries,
		pagination: {
			currentPage: pageNumber,
			pageSize: limitNumber,
			totalRecords,
			totalPages,
		},
	});
};
