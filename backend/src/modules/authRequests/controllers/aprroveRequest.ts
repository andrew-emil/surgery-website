import { Request, Response } from "express";
import { authenticationRequestRepo } from "../../../config/repositories.js";
import { surgeryAuthService } from "../../../config/initializeServices.js";

export const approveRequest = async (req: Request, res: Response) => {
	const requestId = parseInt(req.params.id);

	if (isNaN(requestId)) {
		return res.status(400).json({
			success: false,
			message: "Invalid request ID format",
		});
	}

	await surgeryAuthService.handleRequestApproval(requestId);

	// Fetch updated request details
	const updatedRequest = await authenticationRequestRepo.findOne({
		where: { id: requestId },
		relations: ["surgery", "trainee", "consultant"],
	});

	res.json({
		success: true,
		message: "Request approved successfully",
		data: {
			requestId: updatedRequest.id,
			surgeryId: updatedRequest.surgery.id,
			trainee: `${updatedRequest.trainee.first_name} ${updatedRequest.trainee.last_name}`,
			consultant: `${updatedRequest.consultant.first_name} ${updatedRequest.consultant.last_name}`,
			newStatus: updatedRequest.status,
		},
	});
};
