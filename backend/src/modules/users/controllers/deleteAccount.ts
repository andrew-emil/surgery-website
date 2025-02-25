import { Request, Response } from "express";
import {
	userRepo,
	userPermissionRepo,
} from "../../../config/repositories.js";
import { AppDataSource } from "../../../config/data-source.js";

export const deleteAccount = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params as { id: string };

		// Validate userId
		if (!id) {
			res.status(400).json({ error: "Invalid user ID" });
			return;
		}

		await AppDataSource.transaction(async (transactionalEntityManager) => {
			// Delete dependent records in SQL Repositories
			await transactionalEntityManager.delete(userPermissionRepo.target, {
				assigned_by: id,
			});

			// Delete user
			const result = await transactionalEntityManager.delete(
				userRepo.target,
				id
			);

			if (result.affected && result.affected > 0) {
				res.status(204).end();
			} else {
				res.status(404).json({ error: "User not found" });
			}
		});
	} catch (err) {
		console.error("Error deleting account:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};
