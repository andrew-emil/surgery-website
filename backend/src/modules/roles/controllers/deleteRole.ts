import { Request, Response } from "express";
import { AppDataSource } from "../../../config/data-source.js";
import {
	roleRepo,
	userRepo,
	requirementRepo,
} from "../../../config/repositories.js";

export const deleteRole = async (req: Request, res: Response) => {
	const { id } = req.params;
	const roleId = parseInt(id);

	if (isNaN(roleId)) {
		return res.status(400).json({ error: "Invalid role ID format" });
	}

	const role = await roleRepo.findOne({
		where: { id: roleId },
		relations: ["children", "requirements"],
	});

	if (!role) {
		return res.status(404).json({ error: "Role not found" });
	}

	await AppDataSource.transaction(async (transactionalEntityManager) => {
		await transactionalEntityManager.delete(requirementRepo.target, {
			role: { id: roleId },
		});

		await transactionalEntityManager.update(
			userRepo.target,
			{ role: { id: roleId } },
			{ role: null }
		);

		if (role.children.length > 0) {
			await transactionalEntityManager.update(
				roleRepo.target,
				{ parent: { id: roleId } },
				{ parent: null }
			);
		}

		const result = await transactionalEntityManager.delete(
			roleRepo.target,
			roleId
		);

		if (result.affected === 0) {
			throw new Error("Failed to delete role");
		}
	});

	res.status(204).end();
};
