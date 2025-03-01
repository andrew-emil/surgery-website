import { Request, Response } from "express";
import { departmentRepo } from "../../../config/repositories.js";

export const addDepartment = async (req: Request, res: Response) => {
	const name = req.body.name?.trim();

	if (!name) throw Error("Invalid Department name");

	const existingDepartment = await departmentRepo.findOneBy({ name });

	if (existingDepartment) {
		res.status(400).json({ message: "Department already exists" });
		return;
	}

	const newDepartment = departmentRepo.create({ name });
	await departmentRepo.save(newDepartment);

	res.status(201).json({
		message: "Department added successfully",
	});
};
