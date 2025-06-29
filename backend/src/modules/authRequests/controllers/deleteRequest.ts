import { Request, Response } from "express";
import {
	authenticationRequestRepo,
	surgeryLogsRepo,
} from "../../../config/repositories.js";
import { Authentication_Request } from "../../../utils/dataTypes.js";

export const deleteRequest = async (req: Request, res: Response) => {
	const requestId = parseInt(req.params.id);
	if (isNaN(requestId)) throw Error("Invalid request ID");

	const authRequest = await authenticationRequestRepo.findOne({
		where: { id: requestId },
		relations: ["trainee", "surgery", "consultant"],
	});
	if (!authRequest) {
		res
			.status(404)
			.json({ success: false, message: "Authentication request not found" });
		return;
	}

	if (req.user.id !== authRequest.trainee.id) {
		res.status(403).json({ success: false, message: "Unauthorized" });
		return;
	}

	// Validate request state
	if (authRequest.status === Authentication_Request.APPROVED) {
		res.status(403).json({
			success: false,
			message: "Approved requests cannot be deleted - use cancellation instead",
			currentStatus: authRequest.status,
		});
		return;
	}

	const surgeryLog = await surgeryLogsRepo.findOneBy({
		surgeryId: authRequest.surgery.id,
	});

	if (!surgeryLog) throw Error("Associated surgery log Not Found");

	const initialCount = surgeryLog.doctorsTeam.length;
	surgeryLog.doctorsTeam = surgeryLog.doctorsTeam.filter(
		(doctor) => doctor.doctorId !== authRequest.trainee.id
	);

	if (initialCount === surgeryLog.doctorsTeam.length) {
		res
			.status(404)
			.json({ success: false, message: "Trainee not found in surgery team" });
		return;
	}

	// await Promise.all([
	// 	notificationService.createNotification(
	// 		authRequest.consultant.id,
	// 		NOTIFICATION_TYPES.AUTH_REQUEST,
	// 		`Request from ${authRequest.trainee.first_name} ${authRequest.trainee.last_name} for ${authRequest.surgery.name} was deleted`
	// 	),
	// 	notificationService.createNotification(
	// 		authRequest.trainee.id,
	// 		NOTIFICATION_TYPES.AUTH_REQUEST,
	// 		`Your request for ${authRequest.surgery.name} was deleted`
	// 	),
	// ]);

	const [_, deleteResult] = await Promise.all([
		surgeryLogsRepo.update(
			{ surgeryId: authRequest.surgery.id },
			{ doctorsTeam: surgeryLog.doctorsTeam }
		),
		authenticationRequestRepo.delete(requestId),
	]);

	if (deleteResult.affected === 0) {
		res.status(500).json({
			success: false,
			message: "Failed to delete authentication request after team update",
			requestId,
		});
		return;
	}

	res.status(204).send();
};
