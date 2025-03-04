import { Request, Response } from "express";
import { addAffiliationSchema } from "../../../utils/zodSchemas.js";
import { affiliationRepo } from "../../../config/repositories.js";
import { AffiliationsType } from "../../../utils/dataTypes.js";

export const addAffiliation = async (req: Request, res: Response) => {
	const validation = addAffiliationSchema.safeParse(req.body);

    console.log(validation.error)

	if (!validation.success) throw Error(validation.error.message);

	const { name, country, city, address, institution_type } = validation.data;

	if (
		!Object.values(AffiliationsType).includes(
			institution_type as AffiliationsType
		)
	) {
		throw new Error(`Invalid institution type: ${institution_type}`);
	}

	const existingAffiliation = await affiliationRepo.findOneBy({
		name,
		country,
		city,
		address,
	});

	if (existingAffiliation) {
		res.status(400).json({ message: "Affiliation already exists" });
		return;
	}

	const newAffiliation = affiliationRepo.create({
		name,
		country,
		city,
		address,
		institution_type: institution_type as AffiliationsType,
	});

	await affiliationRepo.save(newAffiliation);

	res.status(201).json({
		message: "Affiliation created successfully",
		newAffiliation,
	});
};
