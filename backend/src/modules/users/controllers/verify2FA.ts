import { Response, Request } from "express";
import { userService } from "../../../config/initializeServices.js";

export const verify2FA = async (req: Request, res: Response) => {
	// #swagger.tags = ['Users']
	const { email, otp } = req.body;

	if (!email || !otp) throw Error("Invalid credentials");

	const result = await userService.verify2FA(email, otp);

	if (!result.success) {
		res.status(400).json(result);
		return;
	}

	res.status(200).json({
		success: result.success,
		message: "Verification successful",
		token: result.token,
	});
};
