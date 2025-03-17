import { Request, Response } from "express";
import { roleRepo } from "../../../config/repositories.js";
import { AppDataSource } from "../../../config/data-source.js";
import { updateRoleSchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { Role } from "../../../entity/sql/Roles.js";
import { Permission } from "../../../entity/sql/Permission.js";

export const updateRole = async (req: Request, res: Response) => {
	const validation = updateRoleSchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const {
		id,
		name,
		parentId,
		permissions,
		requiredSurgeryType,
		requiredCount,
	} = validation.data;

	const role = await roleRepo.findOne({
		where: { id },
		relations: ["parent", "permissions"],
	});

	if (!role) throw Error("Role not found");

	await AppDataSource.transaction(async (transactionalEntityManager) => {
		if (name && name.toLowerCase() !== role.name.toLowerCase()) {
			const existingRole = await transactionalEntityManager
				.createQueryBuilder(Role, "role")
				.where("LOWER(role.name) = LOWER(:name)", { name })
				.getOne();

			if (existingRole) {
				res.status(409).json({
					message: "Role name already exists",
				});
				return;
			}
			role.name = name;
		}

		if (parentId !== undefined) {
			if (parentId === role.id) {
				res.status(400).json({
					message: "A role cannot be its own parent",
				});
				return;
			}

			const parentRole = await transactionalEntityManager.findOneBy(Role, {
				id: parentId,
			});

			if (!parentRole) {
				throw new Error("Parent role not found");
			}
			role.parent = parentRole;
		}

		if (permissions) {
			const validPermissions = await transactionalEntityManager
				.createQueryBuilder(Permission, "permission")
				.where("permission.id IN (:...id)", { id: permissions })
				.getMany();

			const foundIds = validPermissions.map((p) => p.id);
			const invalidIds = permissions.filter((id) => !foundIds.includes(id));

			if (invalidIds.length > 0) {
				throw Error(`Invalid permission IDs: ${invalidIds.join(", ")}`);
			}

			role.permissions.push(...validPermissions);
		}

		if (requiredCount) role.requiredCount = requiredCount;
		if (requiredSurgeryType) role.requiredSurgeryType;

		await transactionalEntityManager.save(role);
	});

	res.status(200).json({ message: "Role updated successfully" });
};
