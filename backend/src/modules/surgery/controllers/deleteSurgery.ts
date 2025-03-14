import { Request, Response } from "express";
import {
	postSurgeryRepo,
	surgeryLogsRepo,
	surgeryRepo,
} from "../../../config/repositories.js";
import { MongoDataSource } from "../../../config/data-source.js";

export const deleteSurgery = async (req: Request, res: Response) => {
	const surgeryId = parseInt(req.params.id);
	if (isNaN(surgeryId)) throw Error("Invalid surgery ID");

	let result = await surgeryRepo.delete({ id: surgeryId });
	if (result.affected || result.affected === 0)
		throw Error("Surgery Not Found");

	try {
		await MongoDataSource.transaction(async (manager) => {
			await manager.delete(surgeryLogsRepo.target, {
				surgeryId,
			});

			await manager.delete(postSurgeryRepo.target, {
				surgeryId,
			});
		});
		res.status(204).end();
	} catch (err) {
		res.status(409).json({
			success: false,
			message: "failed to delete surgery",
			details: err.message,
		});
	}
};
