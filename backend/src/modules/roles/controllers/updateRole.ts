import { Request, Response } from "express";
import { roleRepo, permissionRepo } from "../../../config/repositories.js";
import { AppDataSource } from "../../../config/data-source.js";

export const updateRole = async (req: Request, res: Response) => {
	const {id,  name, permissions, parentName } = req.body;

	if (!id || isNaN(parseInt(id))) throw Error("Invalid Role ID");

	const roleId = parseInt(id);

	const role = await roleRepo.findOne({ 
		where: { id: roleId }, 
		relations: ["parent", "permissions"] 
	});

	if (!role) throw Error("Role not found");

	await AppDataSource.transaction(async (transactionalEntityManager) => {
		role.name = name || role.name;

		if (parentName) {
			const parentRole = await transactionalEntityManager.findOne(roleRepo.target, {
				where: { name: parentName },
			});

			if (!parentRole) throw Error(`Parent Role '${parentName}' not found`);

			if (parentRole.id === role.id)
				throw Error("A role cannot be its own parent");

			role.parent = parentRole;
		}

		if (permissions && permissions.length > 0) {
			const allPermissions = await permissionRepo.find();
			role.permissions = allPermissions.filter((p) =>
				permissions.includes(p.action)
			);
		}

		await transactionalEntityManager.save(role);
	});

	res.status(200).json({ message: "Role updated successfully"});
};
