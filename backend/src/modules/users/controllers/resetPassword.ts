import { Request, Response } from "express";
import crypto from "crypto";
import { userRepo } from "../../../config/repositories.js";
import { MoreThan } from "typeorm";
import bcrypt from "bcrypt";

export const resetPassword = async (req: Request, res: Response) => {
	const { token, newPassword, confirmPassword } = req.body;

	if (newPassword !== confirmPassword) {
		res.status(400).json({ message: "Passwords do not match" });
		return;
	}

	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

	const user = await userRepo.findOneBy({
		reset_token: hashedToken,
		reset_token_expires: MoreThan(new Date()),
	});

	if (!user) {
		res.status(400).json({ error: "Invalid or expired token" });
		return;
	}

	const saltRounds = parseInt(process.env.salt_rounds) || 10;
	const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

	user.password_hash = hashedPassword;
	user.reset_token = null;
	user.reset_token_expires = null;
	await userRepo.save(user);

	res.status(200).json({ message: "Password reset successful" });
};
