import { Request, Response } from "express";
import { updateAffiliationSchema } from "../../../utils/zodSchemas.js";
import { affiliationRepo } from "../../../config/repositories.js";
import { AffiliationsType } from "../../../utils/dataTypes.js";

export const updateAffiliation = async (req: Request, res: Response) => {
	const validation = updateAffiliationSchema.safeParse(req.body);

	if (!validation.success) {
		const errorMessages = validation.error.issues
			.map((issue) => `${issue.path.join(".")} - ${issue.message}`)
			.join(", ");

		throw new Error(errorMessages);
	}
	const { id, institution_type, ...updateData } = validation.data;
	const affiliationId = parseInt(id);

	if (isNaN(parseInt(id))) throw Error("Invalid Affiliation Id");

	const affiliation = await affiliationRepo.findOne({
		where: { id: affiliationId },
	});

	if (!affiliation) throw Error("Affiliation Not Found");

	Object.assign(affiliation, updateData);

	if (institution_type)
		affiliation.institution_type = institution_type as AffiliationsType;

	await affiliationRepo.save(affiliation);

	res.status(200).json({
		affiliation,
	});
};
