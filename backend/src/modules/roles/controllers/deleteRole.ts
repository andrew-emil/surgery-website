import { Request, Response } from "express";
import { AppDataSource } from "../../../config/data-source.js";
import { roleRepo, userRepo } from "../../../config/repositories.js";
import { Role } from "../../../entity/sql/Roles.js";

export const deleteRole = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || isNaN(parseInt(id))) throw Error("Invalid Role Id");

	const roleId = parseInt(id);

	const role = await roleRepo.findOne({
		where: { id: roleId },
		relations: ["children"],
	});

	if (!role) throw Error("Role not found");

	await AppDataSource.transaction(async (transactionalEntityManager) => {
		await transactionalEntityManager.update(
			userRepo.target,
			{ role: role.id },
			{ role: null }
		);

		await transactionalEntityManager
			.createQueryBuilder()
			.relation(Role, "permissions")
			.of(roleId)
			.set([]);

		if (role.children.length > 0) {
			await transactionalEntityManager.update(
				roleRepo.target,
				{ parent: roleId },
				{ parent: null }
			);
		}

		const result = await transactionalEntityManager.delete(roleRepo.target, {
			id: role.id,
		});

		if (result.affected && result.affected > 0) {
			res.status(204).end();
		} else {
			res.status(409).json({
				error: "Failed to delete role",
			});
		}
	});
};
