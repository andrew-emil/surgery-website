import { Request, Response } from "express";
import { addAffiliationSchema } from "../../../utils/zodSchemas.js";
import { affiliationRepo } from "../../../config/repositories.js";
import { AffiliationsType } from "../../../utils/dataTypes.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";

export const addAffiliation = async (req: Request, res: Response) => {
	const validation = addAffiliationSchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const { name, country, city, address, institution_type } = validation.data;

	if (
		!Object.values(AffiliationsType).includes(
			institution_type as AffiliationsType
		)
	) {
		throw Error(`Invalid institution type: ${institution_type}`);
	}

	const existingAffiliation = await affiliationRepo.findOne({
		where: { name, country, city, address },
	});

	if (existingAffiliation) {
		res
			.status(400)
			.json({ success: false, message: "Affiliation already exists" });
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
		success: true,
		message: "Affiliation created successfully",
		newAffiliation,
	});
};
