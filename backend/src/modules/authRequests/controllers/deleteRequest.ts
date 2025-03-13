import { Request, Response } from "express";
import {
	authenticationRequestRepo,
	surgeryLogsRepo,
} from "../../../config/repositories.js";

export const deleteRequest = async (req: Request, res: Response) => {
	const requestId = parseInt(req.params.id);
	if (isNaN(requestId)) throw Error("Invalid Request ID");

	const authRequest = await authenticationRequestRepo.findOne({
		where: { id: requestId },
		relations: ["trainee", "surgery"],
	});
	if (!authRequest) throw Error("Authentcation Request Not Found");

	const surgery = await surgeryLogsRepo.findOneBy({
		surgeryId: authRequest.surgery.id,
	});
	if (!surgery) throw Error("Surgery Not Found");

	surgery.doctorsTeam = surgery.doctorsTeam.filter(
		(doctor) => doctor.doctorId !== authRequest.trainee.id
	);

	const [_, result] = await Promise.all([
		surgeryLogsRepo.update(
			{ surgeryId: surgery.surgeryId },
			{ doctorsTeam: surgery.doctorsTeam }
		),
		authenticationRequestRepo.delete({ id: requestId }),
	]);

	if (result.affected && result.affected > 0) {
		res.status(204).end();
	} else {
		res.status(404).json({
			success: false,
			message: "Failed to delete Authentication Request",
		});
	}
};
