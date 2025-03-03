import { Request, Response } from "express";
import {
	departmentRepo,
	surgeryTypeRepo,
} from "../../../config/repositories.js";
import { updateDepartmentSchema } from "../../../utils/zodSchemas.js";
import { In } from "typeorm";

export const updateDepartment = async (req: Request, res: Response) => {
	const result = updateDepartmentSchema.safeParse(req.body);

	if (!result.success) throw Error(result.error.message);

	const data = result.data;

	if (!data.id || isNaN(parseInt(data.id)))
		throw Error("Invalid department ID");

	const department = await departmentRepo.findOne({
		where: { id: parseInt(data.id) },
		relations: ["surgeryTypes"],
	});

	if (!department) throw Error("Department not found");

	if (data.name) department.name = data.name;

	if (data.surgeryTypes && data.surgeryTypes.length > 0) {
		const allSurgeryTypes = await surgeryTypeRepo.findBy({
			id: In(data.surgeryTypes),
		});

		const missingSurgeryTypes = data.surgeryTypes.filter(
			(id) => !allSurgeryTypes.some((st) => st.id === parseInt(id))
		);

		if (missingSurgeryTypes.length > 0) {
			res.status(404).json({
				error: "Some surgery types not found",
				missingSurgeryTypes,
			});
			return;
		}

		department.surgeryTypes = allSurgeryTypes;
	}

	await departmentRepo.save(department);

	res.status(200).json({
		message: "department updated successfully",
		department,
	});
};
