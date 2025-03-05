import { Request, Response } from "express";
import { userRepo } from "../../../config/repositories.js";

export const deleteAccount = async (req: Request, res: Response) => {
	const { id } = req.params as { id: string };

	// Validate userId
	if (!id) {
		res.status(400).json({ error: "Invalid user ID" });
		return;
	}

	// Delete user
	const result = await userRepo.delete(id);

	if (result.affected && result.affected > 0) {
		res.status(204).end();
	} else {
		res.status(404).json({ error: "User not found" });
	}
};
