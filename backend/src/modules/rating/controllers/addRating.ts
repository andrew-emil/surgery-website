import { Request, Response } from "express";
import { addRatingSchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import {
	ratingRepo,
	surgeryLogsRepo,
	surgeryRepo,
	userRepo,
} from "../../../config/repositories.js";

export const addRating = async (req: Request, res: Response) => {
	const validation = addRatingSchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const { surgeryId, stars, comment } = validation.data;
	const userId = req.user?.id;

	if (!userId) throw Error("Unauthorized");

	const [user, surgery, surgeryLog] = await Promise.all([
		userRepo.findOne({ where: { id: userId } }),
		surgeryRepo.findOneBy({ id: surgeryId }),
		surgeryLogsRepo.findOne({
			where: {
				surgeryId: { $eq: surgeryId },
			},
		}),
	]);

	if (!user) throw new Error("User not found");
	if (!surgery) throw Error("Surgery not found");
	if (!surgeryLog) throw Error("Surgery records not found");

	const isAuthorized =
		surgeryLog.leadSurgeon === userId ||
		surgeryLog.doctorsTeam.some((doctor) => doctor.doctorId === userId);

	if (!isAuthorized) throw Error("Unauthorized");

	let newRating;
	await ratingRepo.manager.transaction(async (transactionalEntityManager) => {
		newRating = ratingRepo.create({ surgeryId, userId, stars, comment });
		await transactionalEntityManager.save(newRating);
	});

	res.status(201).json({
		success: true,
		message: "Rating added successfully",
		data: newRating,
	});
};
