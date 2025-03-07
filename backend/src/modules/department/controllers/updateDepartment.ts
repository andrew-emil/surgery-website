import { Request, Response } from "express";
import {
	affiliationRepo,
	departmentRepo,
	surgeryTypeRepo,
} from "../../../config/repositories.js";
import { updateDepartmentSchema } from "../../../utils/zodSchemas.js";
import { In } from "typeorm";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";

export const updateDepartment = async (req: Request, res: Response) => {
	const result = updateDepartmentSchema.safeParse(req.body);

	if (!result.success) throw Error(formatErrorMessage(result));

	const { id, name, affiliationId, surgeryTypes } = result.data;

	if (!id || isNaN(parseInt(id))) throw Error("Invalid department ID");

	const departmentId = parseInt(id);

	const department = await departmentRepo.findOne({
		where: { id: departmentId },
		relations: ["surgeryTypes", "affiliation"],
	});

	if (!department) throw Error("Department not found");

	if (affiliationId) {
		const affiliation = await affiliationRepo.findOneBy({
			id: parseInt(affiliationId),
		});
		if (!affiliation) throw Error("Affiliation not found");
		department.affiliation = affiliation;
	}

	if (name) department.name = name;

	if (surgeryTypes && surgeryTypes.length > 0) {
		const validSurgeryTypes = await surgeryTypeRepo.findBy({
			id: In(surgeryTypes.map(Number)),
		});

		const missingSurgeryTypes = surgeryTypes.filter(
			(id) => !validSurgeryTypes.some((st) => st.id === parseInt(id))
		);

		if (missingSurgeryTypes.length > 0)
			throw Error("Some surgery types Not Found");

		department.surgeryTypes = validSurgeryTypes;
	}

	await departmentRepo.save(department);

	res.status(200).json({
		success: true,
		message: "Department updated successfully",
		department,
	});
};
