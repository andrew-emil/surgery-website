import { Request, Response } from "express";
import {
	departmentRepo
} from "../../../config/repositories.js";
import { validateSchema } from "../../../utils/validateSchema.js";
import { updateDepartmentSchema } from "../../../utils/zodSchemas.js";

export const updateDepartment = async (req: Request, res: Response) => {
	const { id, name } = validateSchema(updateDepartmentSchema, req.body);

	if (!id || isNaN(parseInt(id))) throw Error("Invalid department ID");

	const departmentId = parseInt(id);

	const department = await departmentRepo.findOne({
		where: { id: departmentId },
		relations: ["affiliation"],
	});

	if (!department) throw Error("Department not found");

	if (name) department.name = name;

	await departmentRepo.save(department);

	res.status(200).json({
		success: true,
		message: "Department updated successfully",
	});
	return;
};
