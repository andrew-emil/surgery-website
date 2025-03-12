import { Request, Response } from "express";
import {
	authenticationRequestRepo,
	surgeryLogsRepo,
} from "../../../config/repositories.js";
import {
	Authentication_Request,
	PARTICIPATION_STATUS,
} from "../../../utils/dataTypes.js";

export const approveRequest = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);

	if (isNaN(id)) throw Error("Invalid request id");

	const authRequest = await authenticationRequestRepo.findOne({
		where: { id },
		relations: ["surgery"],
	});
	if (!authRequest) throw Error("Authentication request Not Found");

	if (authRequest.status !== Authentication_Request.PENDING) {
		res.status(400).json({
			success: false,
			message: "Only pending requests can be approved",
		});
		return;
	}

	const surgery = await surgeryLogsRepo.findOneBy({
		surgeryId: authRequest.surgery.id,
	});

	surgery.doctorsTeam.map((doctor) => {
		if (doctor.doctorId === authRequest.trainee.id) {
			doctor.participationStatus = PARTICIPATION_STATUS.APPROVED;
		}
	});
	authRequest.status = Authentication_Request.APPROVED;

	await Promise.all([
		authenticationRequestRepo.save(authRequest),
		surgeryLogsRepo.save(surgery),
	]);

	res.status(200).json({
		success: true,
		message: "Request approved successfully",
	});
};
