import { Request, Response } from "express";
import { procedureTypeService } from "../../../config/initializeServices.js";

export async function updateProcedureType(req: Request, res: Response) {
	const id = parseInt(req.params.id);
	const updateData = req.body;

	const updatedProcedureType = await procedureTypeService.updateProcedureType(
		id,
		updateData
	);
	if (!updatedProcedureType) throw Error("ProcedureType not found");

	res.status(200).json({ message: "Procedure type updated successfully" });
}
