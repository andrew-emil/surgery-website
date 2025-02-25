import { Request, Response } from "express";
import { roleRepo } from "../../../config/repositories.js";

export const getAllRoles = async (req: Request, res: Response) => {
	const { page = "1", limit = "10" } = req.query;

	const pageNumber = Math.max(1, parseInt(page as string, 10));
	const limitNumber = Math.max(1, parseInt(limit as string, 10));

	const [roles, total] = await Promise.all([
		roleRepo.find({
			skip: (pageNumber - 1) * limitNumber,
			take: limitNumber,
		}),
		roleRepo.count(),
	]);

	if (roles.length === 0) throw Error("No roles found");

	res.status(200).json({
		roles,
		page: pageNumber,
		limit: limitNumber,
		total,
		totalPages: Math.ceil(total / limitNumber),
	});
};
