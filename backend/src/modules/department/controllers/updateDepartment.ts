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
	const validation = updateDepartmentSchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });


	const { id, name, affiliationId, surgeryEquipments } = validation.data;

	if (!id || isNaN(parseInt(id))) throw Error("Invalid department ID");

	const departmentId = parseInt(id);

	const department = await departmentRepo.findOne({
		where: { id: departmentId },
		relations: ["surgeryEquipment", "affiliation"],
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

	if (surgeryEquipments && surgeryEquipments.length > 0) {
		const validsurgeryEquipments = await surgeryTypeRepo.findBy({
			id: In(surgeryEquipments.map(Number)),
		});

		const missingsurgeryEquipments = surgeryEquipments.filter(
			(id) => !validsurgeryEquipments.some((st) => st.id === parseInt(id))
		);

		if (missingsurgeryEquipments.length > 0)
			throw Error("Some surgery types Not Found");

		department.surgeryEquipment = validsurgeryEquipments;
	}

	await departmentRepo.save(department);

	res.status(200).json({
		success: true,
		message: "Department updated successfully",
		department,
	});
};
