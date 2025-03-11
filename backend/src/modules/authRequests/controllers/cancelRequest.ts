import { Request, Response } from "express";
import { authenticationRequestRepo } from "../../../config/repositories.js";
import { Authentication_Request } from "../../../utils/dataTypes.js";

export const cancelRequest = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);

	if (isNaN(id)) throw Error("Invalid request id");

	const authRequest = await authenticationRequestRepo.findOneBy({
		id,
	});
	if (!authRequest) throw Error("Authentication request Not Found");

	if (authRequest.status !== Authentication_Request.PENDING) {
		res.status(400).json({
			success: false,
			message: "Only pending requests can be cancelled",
		});
		return;
	}

	authRequest.status = Authentication_Request.CANCELLED;
	await authenticationRequestRepo.save(authRequest);

	res.status(200).json({
		success: true,
		message: "Request cancelled successfully",
	});
};
