import { Request, Response } from "express";
import { roleRepo } from "../../../config/repositories.js";
import { Not } from "typeorm";

export const getAllRoles = async (req: Request, res: Response) => {
	const [roles, total] = await Promise.all([
		roleRepo.find({
			where: { name: Not("Admin") },
			relations: {
				parent: true, // Maintain the relation
				permissions: true,
			},
			select: {
				id: true,
				name: true,
				permissions: true,
				requiredCount: true,
				requiredSurgeryType: true,
				parent: {
					name: true, // Only select name from parent
				},
				// Add other fields you want to select from the main role
			},
		}),
		roleRepo.count(),
	]);

	if (roles.length === 0) throw Error("No roles Found");

	res.status(200).json({
		roles,
		total,
	});
};
