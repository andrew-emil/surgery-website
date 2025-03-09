import { Request, Response } from "express";
import { UserService } from "../../../service/UserSevice.js";

export const forgetPassword = async (req: Request, res: Response) => {
	const { email } = req.body;

	if (!email) throw Error("Invalid credentials");

	const userService = new UserService();

	await userService.forgetPassword(email);

	res.status(200).json({
		success: true,
		message: "If the email exists, a reset link will be sent.",
	});
};
