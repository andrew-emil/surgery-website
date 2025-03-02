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

	const department = await departmentRepo.findOne({
		where: { id: parseInt(data.id) },
		relations: ["surgeryTypes"],
	});

	if (!department) throw Error("Department not found");

	if (data.name) department.name = data.name;

	if (data.surgeryTypes && data.surgeryTypes.length > 0) {
		const surgeryTypes = await surgeryTypeRepo.findBy({
			id: In(data.surgeryTypes),
		});

		if (surgeryTypes.length !== data.surgeryTypes.length) {
			throw Error("Some surgery types not found");
		}
		department.surgeryTypes = surgeryTypes;
	}

	await departmentRepo.save(department);

	res.status(200).json({
		message: "department updated successfully",
	});
};
