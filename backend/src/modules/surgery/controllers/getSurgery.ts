import { Request, Response } from "express";
import {
	postSurgeryRepo,
	ratingRepo,
	surgeryLogsRepo,
	surgeryTypeRepo,
	userRepo,
} from "../../../config/repositories.js";
import { STATUS } from "../../../utils/dataTypes.js";
import { PostSurgery } from "../../../entity/mongodb/PostSurgery.js";
import { Rating } from "../../../entity/mongodb/Rating.js";
import { In } from "typeorm";

export const getSurgery = async (req: Request, res: Response) => {
	const surgeryId = parseInt(req.params.id);

	if (isNaN(surgeryId)) throw Error("Invalid surgery ID");

	const [surgeryLog, surgeryTypeData] = await Promise.all([
		surgeryLogsRepo.findOneBy({
			surgeryId,
		}),
		surgeryTypeRepo.findOneBy({ id: surgeryId }),
	]);

	if (!surgeryLog || !surgeryTypeData) throw Error("Surgery Not Found");

	let postSurgery: null | PostSurgery = null;
	let rating: null | Rating[] = null;
	let averageRating: number | null = null;
	let doctors = [];

	if (surgeryLog.performedBy.length > 0) {
		doctors = await userRepo.find({
			where: { id: In([surgeryLog.performedBy]) },
			select: ["id", "first_name", "last_name", "email", "role"],
		});
	}

	if (surgeryLog.status == STATUS.COMPLETED) {
		[postSurgery, rating] = await Promise.all([
			postSurgeryRepo.findOneBy({ surgeryId }),
			ratingRepo.findBy({ surgeryId }),
		]);

		if (rating && rating.length > 1) {
			const rawAverage =
				rating.reduce((sum, r) => sum + (r.stars || 0), 0) / rating.length;
			averageRating = Math.max(1, Math.min(5, Math.round(rawAverage)));
		}
	}

	res.status(200).json({
		success: true,
		department: surgeryTypeData.departments,
		surgeryType: surgeryTypeData.name,
		surgeryLog,
		postSurgery,
		rating,
		averageRating,
		doctors,
	});
};
