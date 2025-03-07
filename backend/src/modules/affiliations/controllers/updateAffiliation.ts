import { Request, Response } from "express";
import { updateAffiliationSchema } from "../../../utils/zodSchemas.js";
import { affiliationRepo } from "../../../config/repositories.js";
import { AffiliationsType } from "../../../utils/dataTypes.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";

export const updateAffiliation = async (req: Request, res: Response) => {
	const validation = updateAffiliationSchema.safeParse(req.body);

	if (!validation.success) throw Error(formatErrorMessage(validation));

	const { id, institution_type, ...updateData } = validation.data;
	const affiliationId = parseInt(id);

	if (isNaN(parseInt(id))) throw Error("Invalid Affiliation Id");

	const affiliation = await affiliationRepo.findOne({
		where: { id: affiliationId },
	});

	if (!affiliation) throw Error("Affiliation Not Found");

	if (
		institution_type &&
		!Object.values(AffiliationsType).includes(
			institution_type as AffiliationsType
		)
	) {
		throw new Error(`Invalid institution type: ${institution_type}`);
	}

	Object.assign(affiliation, updateData);

	if (institution_type)
		affiliation.institution_type = institution_type as AffiliationsType;

	await affiliationRepo.save(affiliation);

	res.status(200).json({
		success: true,
		message: "Affiliation updated successfully",
		affiliation,
	});
};
