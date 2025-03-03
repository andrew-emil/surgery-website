import { Request, Response } from "express";
import { AppDataSource } from "../../../config/data-source.js";
import { roleRepo, userRepo } from "../../../config/repositories.js";

export const deleteRole = async (req: Request, res: Response) => {
	const { id } = req.params as { id: string };

	if (!id || isNaN(parseInt(id))) throw Error("Invalid Role Id");

	const roleId = parseInt(id);

	const role = await roleRepo.findOneBy({
		id: roleId,
	});

	if (!role) throw Error("Invalid Role Id");

	await AppDataSource.transaction(async (transactionalEntityManager) => {
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
			throw Error("Role not found");
		}
	});
};
