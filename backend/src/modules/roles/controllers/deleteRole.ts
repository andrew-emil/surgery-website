import { Request, Response } from "express";
import { AppDataSource } from "../../../config/data-source.js";
import {
	roleRepo,
	userPermissionRepo,
	userRepo,
} from "../../../config/repositories.js";

export const deleteRole = async (req: Request, res: Response) => {
	const { id } = req.params as { id: string };

	if (!id) {
		res.status(400).json({ error: "Invalid ID" });
		return;
	}

	const role = await roleRepo.findOneBy({
		id: parseInt(id),
	});

	if (!role) {
		res.status(404).json({ error: "Invalid ID" });
		return;
	}
    
	await AppDataSource.transaction(async (transactionalEntityManager) => {
		await transactionalEntityManager.delete(userPermissionRepo.target, {
			role: role.name,
		});

		await transactionalEntityManager.update(
			userRepo.target,
			{ role: role.id },
			{ role: null }
		);

		const result = await transactionalEntityManager.delete(roleRepo.target, {
			id: role.id,
		});

		if (result.affected && result.affected > 0) {
			res.status(204).end();
		} else {
			res.status(404).json({ error: "Role not found" });
		}
	});
};
