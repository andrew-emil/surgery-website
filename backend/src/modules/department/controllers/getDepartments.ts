import { Request, Response } from "express";
import { departmentRepo } from "../../../config/repositories.js";

export const getDepartments = async (req: Request, res: Response) => {
	const departments = await departmentRepo.find();

	if (!departments || departments.length == 0)
		throw Error("Departments not found");

	res.status(200).json({
		departments,
	});
};
