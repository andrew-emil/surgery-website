import { Request, Response } from "express";
import { scheduleService } from "../../../config/initializeServices.js";

export const getConflictResolutionData = async (
	req: Request,
	res: Response
) => {
	const conflictData = await scheduleService.getConflictResolutionData();

	res.status(200).json({
		success: true,
		conflictData,
	});
};
