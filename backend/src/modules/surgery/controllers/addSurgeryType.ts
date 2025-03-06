import { Request, Response } from "express";
import {
	departmentRepo,
	surgeryTypeRepo,
} from "../../../config/repositories.js";
import { In } from "typeorm";

export const addSurgeryType = async (req: Request, res: Response) => {
	const { name, departmentIds } = req.body;

	if (!name || !Array.isArray(departmentIds) || departmentIds.length === 0)
		throw Error("Invalid Credential");

	const parsedDepartmentIds = departmentIds
		.map((id: any) => parseInt(id))
		.filter((id) => !isNaN(id));

	if (parsedDepartmentIds.length === 0) throw Error("Invalid department IDs");

	const departments = await departmentRepo.findBy({
		id: In(parsedDepartmentIds),
	});
	if (departments.length !== parsedDepartmentIds.length) {
		throw new Error("One or more departments not found");
	}

	const newSurgeryType = surgeryTypeRepo.create({
		name,
		departments,
	});

	await surgeryTypeRepo.save(newSurgeryType);

	res.status(201).json({
		message: "Add Surgery type successfully",
	});
};
