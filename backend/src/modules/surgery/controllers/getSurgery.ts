import { Request, Response } from "express";
import {
	postSurgeryRepo,
	ratingRepo,
	surgeryLogsRepo,
	surgeryTypeRepo,
} from "../../../config/repositories.js";
import { STATUS } from "../../../utils/dataTypes.js";
import { PostSurgery } from "../../../entity/mongodb/PostSurgery.js";
import { Rating } from "../../../entity/mongodb/Rating.js";

export const getSurgery = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || isNaN(parseInt(id))) throw Error("Invalid surgery ID");

	const parsedId = parseInt(id);

	const [surgeryLog, surgery] = await Promise.all([
		surgeryLogsRepo.findOneBy({
			surgeryId: parsedId,
		}),
		surgeryTypeRepo.findOneBy({ id: parsedId }),
	]);

	if (!surgeryLog || !surgery) throw Error("Invalid surgery ID");

	const departmentName = surgery.department?.name || "Unknown Department";

	let postSurgery: null | PostSurgery = null;
	let rating: null | Rating[] = null;

	if (surgeryLog.status == STATUS.COMPLETED) {
		[postSurgery, rating] = await Promise.all([
			postSurgeryRepo.findOneBy({ surgeryId: parsedId }),
			ratingRepo.findBy({ surgeryId: parsedId }),
		]);

		if(rating.length > 1){
			
		}
	}

	res.status(200).json({
		department: departmentName,
		surgeryType: surgery.name,
		surgeryLog,
		postSurgery,
		rating,
	});
};
