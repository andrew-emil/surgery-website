import { Request, Response } from "express";
import { addRatingSchema } from "../../../utils/zodSchemas.js";
import { validateSchema } from "../../../utils/validateSchema.js";
import {
	ratingRepo,
	surgeryLogsRepo,
	userRepo,
} from "../../../config/repositories.js";
import { formatService } from "../../../config/initializeServices.js";

export const addRating = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	if (!userId) throw Error("Unauthorized");

	const { surgeryId, stars, comment } = validateSchema(
		addRatingSchema,
		req.body
	);

	const [user, surgeryLog] = await Promise.all([
		userRepo.findOne({
			where: { id: userId },
			select: ["id", "first_name", "last_name", "picture"],
		}),
		surgeryLogsRepo.findOne({
			where: {
				surgeryId,
			},
		}),
	]);

	if (!user) throw new Error("User not found");
	if (!surgeryLog) throw Error("Surgery records not found");

	const isAuthorized =
		surgeryLog.leadSurgeon === userId ||
		surgeryLog.doctorsTeam.some((doctor) => doctor.doctorId === userId);

	if (!isAuthorized) throw Error("Unauthorized");

	const rating = ratingRepo.create({
		surgeryId,
		userId,
		stars,
		comment,
	});
	const newRating = await ratingRepo.save(rating);

	const formatNewRating = formatService.formatNewRating(newRating, user);

	res.status(201).json({
		success: true,
		message: "Rating added successfully",
		data: formatNewRating,
	});
	return;
};
