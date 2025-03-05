import { Request, Response } from "express";
import { affiliationRepo } from "../../../config/repositories.js";

export const getAffiliations = async (req: Request, res: Response) => {
	const { page = 1 } = req.query;

	const take = 10;
	const skip = (Math.max(parseInt(page as string) || 1, 1) - 1) * take;

	const [affiliations, total] = await affiliationRepo.findAndCount({
		order: { name: "ASC" },
		take,
		skip,
	});

	if (affiliations.length === 0) throw Error("No affiliation found");

	res.status(200).json({
		affiliations,
		page: Math.floor(skip / take) + 1,
		total,
	});
};
