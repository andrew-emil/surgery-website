import { Response, Request } from "express";
import { permissionRepo, roleRepo } from "../../../config/repositories.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { addRoleSchema } from "../../../utils/zodSchemas.js";

export const addRole = async (req: Request, res: Response) => {
	const validation = addRoleSchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const {
		name,
		parentId,
		permissionActions,
		requiredSurgeryType,
		requiredCount,
	} = validation.data;

	const existingRole = await roleRepo
		.createQueryBuilder("role")
		.where("LOWER(role.name) = LOWER(:name)", { name })
		.getOne();

	if (existingRole) {
		res.status(409).json({
			success: false,
			message: "Role already exists",
		});
		return;
	}

	const parentRole = await roleRepo.findOne({
		where: { id: parentId },
		relations: ["children"],
	});

	if (!parentRole) throw Error(`Invalid Parent Name`);

	const permissions = await Promise.all(
		permissionActions.map(async (actionId) => {
			const permission = await permissionRepo.findOneBy({ id: actionId });
			if (!permission) {
				throw new Error(`Permission with ID ${actionId} not found`);
			}
			return permission;
		})
	);

	const newRole = roleRepo.create({
		name,
		parent: parentRole,
		permissions,
		requiredCount,
		requiredSurgeryType,
	});

	await roleRepo.save(newRole);

	res.status(201).json({
		success: true,
		message: "Role added successfully",
	});
};
