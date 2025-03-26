import { Request, Response } from "express";
import {
	postSurgeryRepo,
	surgeryLogsRepo,
	surgeryRepo,
	authenticationRequestRepo,
} from "../../../config/repositories.js";
import { trainingService } from "../../../config/initializeServices.js";

export const deleteSurgery = async (req: Request, res: Response) => {
	const surgeryId = parseInt(req.params.id);

	if (isNaN(surgeryId)) throw Error("Invalid surgery ID format");

	const surgery = await surgeryRepo.findOne({
		where: { id: surgeryId },
		relations: ["hospital", "department"],
	});

	if (!surgery) {
		res.status(404).json({
			success: false,
			message: "Surgery record not found",
		});
		return;
	}

	const relatedIds = {
		surgeryLogId: null,
		postSurgeryId: null,
		authRequestIds: [],
	};

	// MongoDB cleanup first
	const [surgeryLog, postSurgery] = await Promise.all([
		surgeryLogsRepo.findOneBy({ surgeryId }),
		postSurgeryRepo.findOneBy({ surgeryId }),
	]);

	if (surgeryLog) {
		relatedIds.surgeryLogId = surgeryLog.id;
		await surgeryLogsRepo.delete(surgeryLog.id);
	}

	if (postSurgery) {
		relatedIds.postSurgeryId = postSurgery.id;
		await postSurgeryRepo.delete(postSurgery.id);
	}

	// Cleanup training data
	await trainingService.removeSurgeryRecords(surgeryId);

	// Cleanup authentication requests
	const authRequests = await authenticationRequestRepo.find({
		where: { surgery: { id: surgeryId } },
	});
	relatedIds.authRequestIds = authRequests.map((r) => r.id);
	await authenticationRequestRepo.remove(authRequests);

	// Finally delete main surgery record
	await surgeryRepo.delete(surgeryId);

	res.status(204).json({
		success: true,
		message: "Surgery and all related records deleted",
	});
};
