import { Request, Response } from "express";
import { scheduleService } from "../../../config/initializeServices.js";
import { recommendStaffSchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { affiliationRepo } from "../../../config/repositories.js";

export const getRecommendedStaff = async (req: Request, res: Response) => {
	const validation = recommendStaffSchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const { affiliationId, departmentId, date, time } = validation.data;
	const parsedDate = new Date(date);

	const page = parseInt(req.query.page as string) || 1;
	const limit = 10;
	const skip = (page - 1) * limit;

	const affiliation = await affiliationRepo.findOne({
		where: {
			id: affiliationId,
			departments: {
				id: departmentId,
			},
		},
		relations: ["departments", "users"],
	});

	if (!affiliation) throw Error("Affiliation not found");

	const recommendedStaff = await scheduleService.recommendStaff(
		affiliation,
		parsedDate,
		time
	);
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
