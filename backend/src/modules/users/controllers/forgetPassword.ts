import { Request, Response } from "express";
import { userRepo } from "../../../config/repositories.js";
import crypto from "crypto";
import { sendResetEmail } from "../../../utils/sendEmails.js";

export const forgetPassword = async (req: Request, res: Response) => {
	const { email } = req.body;

	if (!email) throw Error("Invalid credentials");

	const user = await userRepo.findOneBy({ email });

	if (!user) {
		res.status(200).json({
			message: "If the email exists, a reset link will be sent.",
		});
		return;
	}

	const resetToken = crypto.randomBytes(32).toString("hex");
	const hashedToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	const expireAt = new Date(Date.now() + 30 * 60 * 1000);

	user.reset_token = hashedToken;
	user.reset_token_expires = expireAt;

	await userRepo.save(user);

	const resetUrl = `http://localhost:5173/forget-password?token=${resetToken}`;
	await sendResetEmail(email, resetUrl);

	res.status(200).json({
		message: "If the email exists, a reset link will be sent.",
	});
};
