import { Request, Response } from "express";
import { scheduleService } from "../../../config/initializeServices.js";

export const getRecommendedStaff = async (req: Request, res: Response) => {
	const page = parseInt(req.query.page as string) || 1;
	const limit = 10;
	const skip = (page - 1) * limit;

	const recommendedStaff = await scheduleService.recommendStaff();
	const flattenedStaff = Object.entries(recommendedStaff).flatMap(
		([expertise, staffArray]) =>
			staffArray.map((staff) => ({ ...staff, expertise }))
	);

	const total = flattenedStaff.length;
	const paginatedStaff = flattenedStaff.slice(skip, skip + limit);

	res.status(200).json({
		success: true,
		recommendedStaff: paginatedStaff,
		pagination: {
			page,
			total,
			numberOfPages: Math.ceil(total / limit),
		},
	});
};
