import { Request, Response } from "express";
import { surgeryLogsRepo, userRepo } from "../../../config/repositories.js";
import { getTeamPerformancePipeline } from "../../../utils/pipelines.js";

export const getPerformance = async (req: Request, res: Response) => {
	const { affiliationId } = req.params;

	if (!affiliationId) throw Error("Invalid credentials");

	const qb = userRepo
		.createQueryBuilder("user")
		.leftJoin("user.progress", "progress")
		.leftJoin("user.affiliation", "affiliation")
		.select([
			"user.id AS userId",
			"CONCAT(user.first_name, ' ', user.last_name) AS doctorName",
			"AVG(progress.completedCount) AS avg_surgeries",
		])
		.where("affiliation.id = :affiliationId", { affiliationId })
		.groupBy("user.id");

	const teams = await qb.getRawMany();

	const userIds = teams.map((team) => team.userId);

	if (userIds.length === 0) {
		res.status(200).json({ success: true, teams: [] });
		return;
	}

	const pipeline = getTeamPerformancePipeline(userIds);

	const avgRatings: any[] = await surgeryLogsRepo.aggregate(pipeline).toArray();

	const ratingMap = new Map();
	avgRatings.forEach((rating) => {
		ratingMap.set(rating._id, rating.avgRating);
	});

	const teamsWithRatings = teams.map((team) => ({
		doctorName: team.doctorName,
		avg_surgeries: parseFloat(team.avg_surgeries) || 0,
		avg_rating: ratingMap.get(team.userId)?.toFixed(2) || 0,
	}));

	res.status(200).json({
		success: true,
		teams: teamsWithRatings,
	});
};
