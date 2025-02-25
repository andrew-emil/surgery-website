import { Request, Response } from "express";
import { roleRepo } from "../../../config/repositories.js";

export const updateRole = async (req: Request, res: Response) => {
	const { id } = req.params as { id: string };
	const { name } = req.body;

	if (!id) {
		res.status(400).json({ error: "Invalid Role ID" });
		return;
	}

	const role = await roleRepo.findOneBy({ id: parseInt(id) });
	if (!role) throw Error("Role not found");

	if (name) role.name = name;

	const updatedRole = await roleRepo.save(role);

	res
		.status(200)
		.json({ message: "Role updated successfully", role: updatedRole });
};
