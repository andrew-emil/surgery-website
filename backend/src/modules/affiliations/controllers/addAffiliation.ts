import { Request, Response } from "express";
import { addAffiliationSchema } from "../../../utils/zodSchemas.js";
import { affiliationRepo } from "../../../config/repositories.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { validateSchema } from "../../../utils/validateSchema.js";

export const addAffiliation = async (req: Request, res: Response) => {
	const { name, country, city, address, institution_type } = validateSchema(
		addAffiliationSchema,
		req.body
	);

	const existingAffiliation = await affiliationRepo.findOne({
		where: { name, country, city, address },
	});

	if (existingAffiliation) {
		res
			.status(409)
			.json({ success: false, message: "Affiliation already exists" });
		return;
	}

	const newAffiliation = affiliationRepo.create({
		name,
		country,
		city,
		address,
		institution_type: institution_type,
	});

	await affiliationRepo.save(newAffiliation);

	res.status(201).json({
		success: true,
		message: "Affiliation created successfully",
		affiliation: newAffiliation,
	});
};
