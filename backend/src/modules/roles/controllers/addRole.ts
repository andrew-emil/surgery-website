import { Response, Request } from "express";
import { permissionRepo, roleRepo } from "../../../config/repositories.js";

export const addRole = async (req: Request, res: Response) => {
	const { name, permissions } = req.body;

	if (!name || !Array.isArray(permissions)) throw Error("Invalid credentials");

	const existingRole = await roleRepo.findOneBy({ name });

	if (existingRole) {
		res.status(409).json({
			error: "Role already exists",
		});
		return;
	}

	const allPermissions = await permissionRepo.find();

	const newRole = roleRepo.create({
		name,
		permissions: allPermissions.filter((p) => permissions.includes(p.action)),
	});
	await roleRepo.save(newRole);

	res.status(201).json({
		message: "Role added successfully",
		role: newRole
	});
};
