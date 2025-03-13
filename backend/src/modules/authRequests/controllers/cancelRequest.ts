import { Request, Response } from "express";
import {
	authenticationRequestRepo,
	surgeryLogsRepo,
} from "../../../config/repositories.js";
import { Authentication_Request } from "../../../utils/dataTypes.js";

export const cancelRequest = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);

	if (isNaN(id)) throw Error("Invalid request id");

	const authRequest = await authenticationRequestRepo.findOne({
		where: { id },
		relations: ["surgery", "trainee"],
	});
	if (!authRequest) throw Error("Authentication request Not Found");

	if (authRequest.status !== Authentication_Request.PENDING) {
		res.status(400).json({
			success: false,
			message: "Only pending requests can be cancelled",
		});
		return;
	}

	const surgery = await surgeryLogsRepo.findOneBy({
		surgeryId: authRequest.surgery.id,
	});
	if (!surgery) throw Error("Surgery Not Found");

	surgery.doctorsTeam = surgery.doctorsTeam.filter(
		(doctor) => doctor.doctorId !== authRequest.trainee.id
	);

	authRequest.status = Authentication_Request.CANCELLED;
	await Promise.all([
		surgeryLogsRepo.update(
			{ surgeryId: authRequest.surgery.id },
			{ doctorsTeam: surgery.doctorsTeam }
		),
		authenticationRequestRepo.save(authRequest),
	]);

	res.status(200).json({
		success: true,
		message: "Request cancelled successfully",
	});
};
