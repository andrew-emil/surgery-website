import { Request, Response } from "express";
import { userRepo } from "../../../config/repositories.js";

export const deleteAccount = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const userId = req.params.id as string;

		if (!userId) throw Error("Invalid credentials");

		const result = await userRepo.delete(userId);
		//TODO: delete other rows

		// Check if any rows were affected
		if (result.affected && result.affected > 0) {
			res.status(204).end();
			return;
		} else {
			res.status(404).json({ message: "User not found" });
			return;
		}
	} catch (err) {
		console.error("Error deleting account:", err);
		throw Error("Internal server error");
	}
};
