import { Response, Request } from "express";
import { registerSchema } from "../../../utils/zodSchemas.js";
import { userRepo } from "../../../config/repositories.js";
import bcrypt from "bcrypt";
import { sendVerificationEmails } from "../../../utils/sendEmails.js";
import { createOtp } from "../../../utils/createOTP.js";

export const register = async (req: Request, res: Response) => {
	const userInput = registerSchema.parse(req.body);

	if (userInput.password !== userInput.confirm_password) {
		res.status(400).json({ message: "Passwords do not match" });
		return;
	}

	const existingUser = await userRepo.findOneBy({ email: userInput.email });
	if (existingUser) {
		res.status(409).json({ error: "Email is already registered" });
		return;
	}

	const saltRounds = parseInt(process.env.salt_rounds) || 10;
	const hashedPassword = await bcrypt.hash(userInput.password, saltRounds);

	const { otp, hashedOtp } = await createOtp(saltRounds);

	await userRepo.insert({
		first_name: userInput.first_name,
		last_name: userInput.last_name,
		email: userInput.email,
		phone_number: userInput.phone_number,
		password_hash: hashedPassword,
		otp_secret: hashedOtp,
	});

	await sendVerificationEmails(userInput.email, otp);

	res
		.status(202)
		.json({ message: "OTP sent. Please verify to complete login." });
};
