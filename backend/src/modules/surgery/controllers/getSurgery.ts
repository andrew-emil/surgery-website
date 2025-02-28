import { Request, Response } from "express";
import {
	postSurgeryRepo,
	ratingRepo,
	surgeryLogsRepo,
} from "../../../config/repositories.js";
import { STATUS } from "../../../utils/dataTypes.js";
import { PostSurgery } from "../../../entity/mongodb/PostSurgery.js";
import { Rating } from "../../../entity/mongodb/Rating.js";

export const getSurgery = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || typeof parseInt(id) !== "number") {
		res.status(400).json({ error: "Invalid surgery ID" });
		return;
	}

	const surgery = await surgeryLogsRepo.findOneBy({ surgeryId: parseInt(id) });

	if (!surgery) {
		res.status(400).json({ error: "Invalid surgery ID" });
		return;
	}

	let postSurgery: null | PostSurgery = null;
    let rating: null | Rating = null;

	if (surgery.status == STATUS.COMPLETED) {
		postSurgery = await postSurgeryRepo.findOneBy({ surgeryId: parseInt(id) });
        rating = await ratingRepo.findOneBy({ surgeryId: parseInt(id) });
	}

    
};
