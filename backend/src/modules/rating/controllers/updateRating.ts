import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb";
import { MongoDataSource } from "../../../config/data-source.js";
import { Rating } from "../../../entity/mongodb/Rating.js";
import { userRepo } from "../../../config/repositories.js";

export const updateRating = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) throw Error("Invalid Id format");
	const formatedID = new ObjectId(id);

	const { stars, comment } = req.body;
	if (!stars && !comment) throw Error("Invalid credentails");

	const userId = req.user?.id;
	if (!userId) throw Error("Unauthorized");

	const user = await userRepo.findOne({ where: { id: userId } });
	if (!user) throw new Error("User not found");

	await MongoDataSource.transaction(async (manager) => {
		const rating = await manager.findOne(Rating, {
			where: { _id: formatedID } as any,
		});
		if (!rating) throw Error("Rating not found");
		if (user.id !== rating.userId) throw Error("Unauthorized");

		await manager.update(
			Rating,
			{ id: rating.id },
			{
				stars: stars ? stars : rating.stars,
				comment: comment ? comment.trim() : rating.comment,
				createdAt: new Date(),
			}
		);
	});

	res.status(202).json({
		success: true,
		message: "Rating updated successfully",
	});
};
