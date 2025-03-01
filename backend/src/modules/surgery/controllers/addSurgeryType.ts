import { Request, Response } from "express";
import {
	departmentRepo,
	surgeryTypeRepo,
} from "../../../config/repositories.js";

export const addSurgeryType = async (req: Request, res: Response) => {
	const { name, departmentId } = req.body;

	if (!name || !departmentId || isNaN(parseInt(departmentId)))
		throw Error("Invalid Credential");

	const existingDepartment = await departmentRepo.findOneBy({
		id: parseInt(departmentId),
	});

	if (!existingDepartment) throw Error("Invalid department name");

	await surgeryTypeRepo.insert({
		name,
		department: existingDepartment,
	});

	res.status(201).json({
		message: "Add Surgery type successfully",
	});
};
