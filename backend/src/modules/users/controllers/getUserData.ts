import { Request, Response } from "express";
import { userRepo } from "../../../config/repositories.js";

export const getUserData = async (req: Request, res: Response) => {
	if (!req.user) throw Error("Unauthorized");
	const userId = req.user?.id;

	const user = await userRepo.findOne({
		where: { id: userId },
		relations: {
			department: true,
			affiliation: true,
		},
		select: {
			id: true,
			email: true,
			phone_number: true,
			picture: true,
			department: {
				id: true,
				name: true,
			},
			affiliation: {
				id: true,
				name: true,
				address: true,
				city: true,
			},
		},
	});

	if (!user) throw Error("user not found");

	res.status(200).json({
		success: true,
		user,
	});
};
