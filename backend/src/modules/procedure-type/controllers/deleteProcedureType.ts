import { Request, Response } from "express";
import { procedureTypeService } from "../../../config/initializeServices.js";

export async function deleteProcedureType(req: Request, res: Response) {
	const id = parseInt(req.params.id, 10);

	const deleted = await procedureTypeService.deleteProcedureType(id);
	if (!deleted) 
		throw Error("ProcedureType not found");
	
	res.status(204).end();
}
