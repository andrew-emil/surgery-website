import { Request, Response } from "express";
import {
	departmentRepo,
	affiliationRepo,
} from "../../../config/repositories.js";
import { validateSchema } from "../../../utils/validateSchema.js";
import { addDepartmentSchema } from "../../../utils/zodSchemas.js";

export const addDepartment = async (req: Request, res: Response) => {
	const { name, affiliationId } = validateSchema(addDepartmentSchema, req.body);

	const trimmedName = name.trim();

	const affiliation = await affiliationRepo.findOneBy({
		id: parseInt(affiliationId),
	});
	if (!affiliation) throw Error("Affiliation Not Found");

	const existingDepartment = await departmentRepo.findOne({
		where: { name: trimmedName, affiliation: { id: parseInt(affiliationId) } },
	});

	if (existingDepartment) {
		res.status(400).json({ message: "Department already exists" });
		return;
	}

	const newDepartment = departmentRepo.create({
		name: trimmedName,
		affiliation,
	});
	await departmentRepo.save(newDepartment);

	res.status(201).json({
		success: true,
		message: "Department added successfully",
		department: newDepartment,
	});
	return;
};
