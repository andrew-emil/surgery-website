import { Request, Response } from "express";
import {
	roleRepo,
	requirementRepo,
	procedureTypeRepo,
} from "../../../config/repositories.js";
import { AppDataSource } from "../../../config/data-source.js";
import { updateRoleSchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { Role } from "../../../entity/sql/Roles.js";
import { Permission } from "../../../entity/sql/Permission.js";

export const updateRole = async (req: Request, res: Response) => {
	const validation = updateRoleSchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const { id, name, parentId, permissions, procedureRequirements } =
		validation.data;

	const role = await roleRepo.findOne({
		where: { id },
		relations: ["parent", "permissions", "requirements.procedure.category"],
	});

	if (!role) {
		res.status(404).json({ success: false, message: "Role not found" });
		return;
	}

	await AppDataSource.transaction(async (transactionalEntityManager) => {
		if (name && name.toLowerCase() !== role.name.toLowerCase()) {
			const existingRole = await transactionalEntityManager
				.createQueryBuilder("Role", "role")
				.where("LOWER(role.name) = LOWER(:name)", { name })
				.getOne();

			if (existingRole) {
				throw new Error("Role name already exists");
			}
			role.name = name;
		}

		if (parentId !== undefined) {
			if (parentId === role.id) {
				res.status(400).json({
					success: false,
					message: "A role cannot be its own parent",
				});
				return;
			}
			const parentRole = (await transactionalEntityManager.findOne("Role", {
				where: { id: parentId },
			})) as Role;
			role.parent = parentRole || null;
		}

		if (permissions) {
			const validPermissions = (await transactionalEntityManager
				.createQueryBuilder("Permission", "permission")
				.where("permission.id IN (:...ids)", { ids: permissions })
				.getMany()) as Permission[];

			role.permissions = validPermissions;
		}

		if (procedureRequirements) {
			const existingReqIds = role.requirements.map((r) => r.id);
			const newReqIds = procedureRequirements
				.filter((r) => r.id)
				.map((r) => r.id!);
			const toDelete = existingReqIds.filter((id) => !newReqIds.includes(id));

			if (toDelete.length > 0) {
				await transactionalEntityManager.delete("Requirement", toDelete);
			}

			for (const req of procedureRequirements) {
				const procedure = await procedureTypeRepo.findOne({
					where: { id: req.procedureTypeId },
					relations: ["category"],
				});

				if (!procedure) {
					throw new Error(`Procedure type not found`);
				}

				if (procedure.category !== req.category) {
					res.status(400).json({
						success: false,
						message: `Category mismatch for ${procedure.name}: Expected ${procedure.category}, got ${req.category}`,
					});
					return;
				}

				if (req.id) {
					await transactionalEntityManager.update("Requirement", req.id, {
						requiredCount: req.requiredCount,
					});
				} else {
					const newReq = requirementRepo.create({
						role,
						procedure,
						requiredCount: req.requiredCount,
					});
					await transactionalEntityManager.save(newReq);
				}
			}
		}

		await transactionalEntityManager.save(role);
	});

	res.status(200).json({
		success: true,
		message: "Role Updated successfully",
	});
};
