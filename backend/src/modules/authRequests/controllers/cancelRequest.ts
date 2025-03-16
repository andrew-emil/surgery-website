import { Request, Response } from "express";
import {
	authenticationRequestRepo,
	surgeryLogsRepo,
} from "../../../config/repositories.js";
import {
	Authentication_Request,
	NOTIFICATION_TYPES,
} from "../../../utils/dataTypes.js";
import { notificationService } from "../../../config/initializeServices.js";

export const cancelRequest = async (req: Request, res: Response) => {
	const { requestId, rejectionReason } = req.body;

	if (isNaN(requestId)) throw Error("Invalid request ID format");

	const authRequest = await authenticationRequestRepo.findOne({
		where: { id: requestId },
		relations: ["surgery", "trainee", "consultant", "requestedRole"],
	});

	if (!authRequest) throw Error("Authentication request Not Found");

	if (authRequest.status !== Authentication_Request.PENDING) {
		res.status(400).json({
			success: false,
			message: "Only pending requests can be cancelled",
			currentStatus: authRequest.status,
		});
		return;
	}

	// Find surgery log
	const surgeryLog = await surgeryLogsRepo.findOneBy({
		surgeryId: authRequest.surgery.id,
	});

	if (!surgeryLog) throw Error("Associated surgery log Not Found");

	// Find doctor in team
	const doctorIndex = surgeryLog.doctorsTeam.findIndex(
		(doctor) => doctor.doctorId === authRequest.trainee.id
	);

	if (doctorIndex === -1) throw Error("Trainee not found in surgery team");

	// Update records
	surgeryLog.doctorsTeam.splice(doctorIndex, 1);
	authRequest.status = Authentication_Request.CANCELLED;
	if (rejectionReason) authRequest.rejectionReason = rejectionReason;

	await Promise.all([
		// Notify consultant
		notificationService.createNotification(
			authRequest.consultant.id,
			NOTIFICATION_TYPES.AUTH_REQUEST,
			`Request from ${authRequest.trainee.first_name} ${authRequest.trainee.last_name} for ${authRequest.surgery.name} has been cancelled`
		),
		// Notify trainee
		notificationService.createNotification(
			authRequest.trainee.id,
			NOTIFICATION_TYPES.AUTH_REQUEST,
			`Your request for ${authRequest.surgery.name} has been cancelled`
		),
	]);

	// Save changes
	await Promise.all([
		surgeryLogsRepo.update(
			{ surgeryId: authRequest.surgery.id },
			{ doctorsTeam: surgeryLog.doctorsTeam }
		),
		authenticationRequestRepo.save(authRequest),
	]);

	res.status(200).json({
		success: true,
		message: "Request cancelled successfully",
	});
};
