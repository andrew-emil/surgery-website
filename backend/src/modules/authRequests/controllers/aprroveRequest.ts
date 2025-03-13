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
		relations: ["surgery", "trainee"],
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

	if (!surgery) throw Error("Surgery Not Found");

	const doctorIndex = surgery.doctorsTeam.findIndex(
		(doctor) => doctor.doctorId === authRequest.trainee.id
	);
	if (doctorIndex === -1) throw Error("Doctor Not Found in surgery team");

	surgery.doctorsTeam[doctorIndex].participationStatus =
		PARTICIPATION_STATUS.APPROVED;
	authRequest.status = Authentication_Request.APPROVED;

	await Promise.all([
		authenticationRequestRepo.save(authRequest),
		surgeryLogsRepo.update(
			{ surgeryId: authRequest.surgery.id },
			{ doctorsTeam: surgery.doctorsTeam }
		),
	]);

	res.status(200).json({
		success: true,
		message: "Request approved successfully",
	});
};
