import { Request, Response } from "express";
import {
	authenticationRequestRepo,
	roleRepo,
	surgeryRepo,
	userRepo,
} from "../../../config/repositories.js";
import { AuthenticationRequest } from "../../../entity/sql/AuthenticationRequests.js";
import { Authentication_Request } from "../../../utils/dataTypes.js";

export const createRequest = async (req: Request, res: Response) => {
	const { surgeryId, traineeId, consultantId } = req.body;

	if (!surgeryId || !traineeId || !consultantId)
		throw Error("Invalid credentials");

	const surgery = await surgeryRepo.findOneBy({
		id: surgeryId,
	});

	if (!surgery) throw Error("Surgery not Found");

	const trainee = await userRepo.findOneBy({
		id: traineeId,
	});

	if (!trainee) throw Error("Invalid user data");

	const consultantRole = await roleRepo.findOneBy({ name: "Consultant" });

	if (!consultantRole)
		throw Error("Consultant role is not defined in the system.");

	const consultant = await userRepo.findOneBy({
		id: consultantId,
		role: consultantRole,
	});

	if (!consultant) throw Error("Invalid Consultant data");

	const existingRequest = await authenticationRequestRepo.findOne({
		where: {
			surgery: { id: surgeryId },
			trainee: { id: traineeId },
			status: Authentication_Request.PENDING,
		},
	});
	if (existingRequest) {
		res.status(409).json({
			success: false,
			message:
				"An authentication request is already pending for this trainee in the specified surgery.",
		});
	}

	const authRequest = new AuthenticationRequest();
	authRequest.surgery = surgery;
	authRequest.trainee = trainee;
	authRequest.consultant = consultant;
	authRequest.status = Authentication_Request.PENDING;

	await authenticationRequestRepo.save(authRequest);

	res.status(201).json({
		success: true,
		message: "Request has been sent",
	});
};
