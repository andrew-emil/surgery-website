import { Request, Response } from "express";
import {
	ratingRepo,
	surgeryLogsRepo,
	surgeryRepo,
} from "../../../config/repositories.js";
import { STATUS } from "../../../utils/dataTypes.js";
import { formatRatings } from "../../../utils/formatRating.js";

interface SurgeryInterface {
	id: number;
	name: string;
	date: Date;
	time: string;
	status: STATUS;
	stars: number;
	icdCode: string;
	cptCode: string;
}

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
	const names = await Promise.all(
		surgeries.map(async (sur) => {
			const surgeriesName = await surgeryRepo.findOne({
				where: {
					id: sur.surgeryId,
				},
				select: ["id", "name"],
			});
			return surgeriesName.name;
		})
	);

	const ratings = await Promise.all(
		surgeries.map(async (sur) => {
			const rating = await ratingRepo.find({
				where: {
					surgeryId: { $eq: sur.surgeryId },
				},
			});

			return rating;
		})
	);

	const formatedRating = await Promise.all(
		ratings.map(async (rating) => {
			if (rating.length > 0) {
				const { average } = await formatRatings(rating);
				return average;
			}
			return null;
		})
	);
	const formatedSurgeries: SurgeryInterface[] = surgeries.map(
		(surgery, index) => ({
			id: surgery.surgeryId,
			name: names[index],
			date: surgery.date,
			time: surgery.time,
			status: surgery.status,
			stars: formatedRating[index] ? formatedRating[index] : 0,
			icdCode: surgery.icdCode,
			cptCode: surgery.cptCode,
		})
	);

	res.status(200).json({
		surgeries: formatedSurgeries,
	});
};
