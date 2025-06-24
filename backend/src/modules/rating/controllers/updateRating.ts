import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { MongoDataSource } from "../../../config/data-source.js";
import { Rating } from "../../../entity/mongodb/Rating.js";
import { userRepo } from "../../../config/repositories.js";
import { validateSchema } from "../../../utils/validateSchema.js";
import { updateRatingSchema } from "../../../utils/zodSchemas.js";
import { formatService } from "../../../config/initializeServices.js";

export const updateRating = async (req: Request, res: Response) => {
	const id = req.params.id;
	if (!id) throw Error("Invalid Id format");
	const formattedID = new ObjectId(id);

	const userId = req.user?.id;
	if (!userId) throw Error("Unauthorized");

	const { stars, comment } = validateSchema(updateRatingSchema, req.body);

	const user = await userRepo.findOne({ where: { id: userId } });
	if (!user) throw new Error("User not found");

	let formatNewRating: any;
	
	await MongoDataSource.transaction(async (manager) => {
		const rating = await manager.findOne(Rating, {
			where: { _id: formattedID } as any,
		});
		if (!rating) throw Error("Rating not found");
		if (user.id !== rating.userId) throw Error("Unauthorized");

		rating.stars = stars ? stars : rating.stars;
		rating.comment = comment ? comment.trim() : rating.comment;
		rating.createdAt = new Date();

		const updatedRating = await manager.save(Rating, rating);

		formatNewRating = formatService.formatNewRating(updatedRating, user);
	});

	res.status(202).json({
		success: true,
		message: "Rating updated successfully",
		updateRating: formatNewRating,
	});
	return;
};
