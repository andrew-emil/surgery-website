import { Request, Response } from "express";
import { userRepo } from "../../../config/repositories.js";

export const getPerformance = async (req: Request, res: Response) => {
	const { affiliationId } = req.params;

	if (!affiliationId) throw Error("Invalid credentials");

	const qb = userRepo
		.createQueryBuilder("user")
		.leftJoin("user.progress", "progress")
		.leftJoin("user.affiliation", "affiliation")
		.select([
			"CONCAT(user.first_name, ' ', user.last_name) AS doctorName",
			"AVG(progress.completedCount) AS avg_surgeries",
		])
		.where("affiliation.id = :affiliationId", { affiliationId })
		.groupBy("user.id");

	const teams = await qb.getRawMany();

	res.status(200).json({
		success: true,
		teams,
	});
};
