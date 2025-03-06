import { Request, Response } from "express";
import { userRepo } from "../../../config/repositories.js";

export const deleteAccount = async (req: Request, res: Response) => {
	const { id } = req.params;

	// Validate userId
	if (!id) throw Error("Invalid user ID");

	// Delete user
	const result = await userRepo.delete(id);

	if (result.affected && result.affected > 0) {
		res.status(204).end();
	} else {
		res.status(404).json({
			success: false,
			message: "User not found",
		});
	}
};
