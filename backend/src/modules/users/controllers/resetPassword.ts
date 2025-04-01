import { Request, Response } from "express";
import { userService } from "../../../config/initializeServices.js";

export const resetPassword = async (req: Request, res: Response) => {
	const { token, newPassword } = req.body;

	if (!token || !newPassword) throw Error("Invalid credentials");

	const result = await userService.resetPassword(token, newPassword);

	if (!result.success) res.status(400).json(result);

	res.status(200).json();
};
