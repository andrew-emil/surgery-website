import { Request, Response } from "express";
import { surgicalRolesRepo } from "../../../config/repositories.js";

export const getSurgicalRoles = async (req: Request, res: Response) => {
	const surgicalRole = await surgicalRolesRepo.find();

	res.status(200).json(surgicalRole);
};
