import { Response, Request } from "express";
import { roleRepo } from "../../../config/repositories.js";

export const addRole = async (req: Request, res: Response) => {
	const { name, parentName } = req.body;

	if (!name) throw Error("Invalid credentials");

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

	if (parentName && !parentRole)
		throw Error(`Invalid Parent Name: ${parentName}`);

	const newRole = roleRepo.create({
		name,
		parent: parentRole,
	});
	await roleRepo.save(newRole);

	res.status(201).json({
		success: true,
		message: "Role added successfully",
		role: newRole,
	});
};
