import { Request, Response } from "express";
import { procedureTypeService } from "../../../config/initializeServices.js";

export async function addProcedureType(req: Request, res: Response) {
	const { name, category } = req.body;

	if (!name || !category) throw Error("Invalid credentials");

	await procedureTypeService.createProcedureType({
		name,
		category,
	});

	res.status(201).json({ message: "Procedure type added successfully" });
}
