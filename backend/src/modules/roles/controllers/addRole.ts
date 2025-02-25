import { Response, Request } from "express";
import { roleRepo } from "../../../config/repositories.js";

export const addRole = async (req: Request, res: Response) => {
	const { name } = req.body;

	if (!name) throw new Error("Invalid credentials");

	const existingRole = await roleRepo.findOneBy({ name });

	if (existingRole) {
		res.status(409).json({
			error: "Role already exists",
		});
		return;
	}

	await roleRepo.insert({
		name,
	});

	res.status(201).json({
		message: "Role added successfully",
	});
};
