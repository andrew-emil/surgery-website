import { Request, Response } from "express";
import { procedureTypeService } from "../../../config/initializeServices.js";

export async function getAllProcedureTypes(req: Request, res: Response) {
	const procedureTypes = await procedureTypeService.getAllProcedureTypes();

	res.status(200).json(procedureTypes);
}
