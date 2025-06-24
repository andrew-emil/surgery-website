import { Request, Response } from "express";
import { MongoDataSource } from "../../../config/data-source.js";
import { Rating } from "../../../entity/mongodb/Rating.js";
import { ObjectId } from "mongodb";
import { userRepo } from "../../../config/repositories.js";

export const deleteRating = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) throw Error("Invalid Id format");
	const formattedID = new ObjectId(id);

	const userId = req.user?.id;
	if (!userId) throw Error("Unauthorized");

	const user = await userRepo.findOne({ where: { id: userId } });
	if (!user) throw new Error("User not found");

	await MongoDataSource.transaction(async (manager) => {
		const rating = await manager.findOne(Rating, {
			where: { _id: formattedID } as any,
		});
		if (!rating) throw Error("Rating not found");
		if (user.id !== rating.userId) throw Error("Unauthorized");

		await manager.delete(Rating, { id: formattedID });
	});

	res.status(204).json({
		success: true,
		message: "Rating deleted successfully",
	});
	return;
};
