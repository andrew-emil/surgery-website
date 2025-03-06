import { Response, Request } from "express";
import { permissionRepo, roleRepo } from "../../../config/repositories.js";

export const addRole = async (req: Request, res: Response) => {
	const { name, permissions, parentName } = req.body;

	if (!name || !Array.isArray(permissions)) throw Error("Invalid credentials");

	const existingRole = await roleRepo.findOneBy({ name });

	if (existingRole) {
		res.status(409).json({
			error: "Role already exists",
		});
		return;
	}

	const parentRole = parentName
		? await roleRepo.findOne({
				where: { name: parentName },
				relations: ["children"],
		})
		: null;

	if (parentName && !parentRole) {
		throw Error(`Invalid Parent Name: ${parentName}`);
	}

	const allPermissions = await permissionRepo.find();

	const newRole = roleRepo.create({
		name,
		parent: parentRole,
		permissions: allPermissions.filter((p) => permissions.includes(p.action)),
	});
	await roleRepo.save(newRole);

	res.status(201).json({
		message: "Role added successfully",
		role: newRole,
	});
};
