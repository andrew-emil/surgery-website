import { Request, Response } from "express";
import { roleRepo } from "../../../config/repositories.js";
import { Not } from "typeorm";

export const getAllRoles = async (req: Request, res: Response) => {
	const [roles, total] = await Promise.all([
		roleRepo.find({
			where: { name: Not("Admin") },
		}),
		roleRepo.count(),
	]);

	if (roles.length === 0) throw Error("No roles Found");

	res.status(200).json({
		roles,
		total,
	});
};
