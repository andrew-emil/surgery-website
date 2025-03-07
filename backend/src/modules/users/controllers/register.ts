import { Response, Request } from "express";
import { registerSchema } from "../../../utils/zodSchemas.js";
import { userRepo } from "../../../config/repositories.js";
import bcrypt from "bcrypt";
import { sendVerificationEmails } from "../../../utils/sendEmails.js";
import { createOtp } from "../../../utils/createOTP.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";

export const register = async (req: Request, res: Response) => {
	const validation = registerSchema.safeParse(req.body);

	if (!validation.success) {
		const errorMessages = formatErrorMessage(validation);

		throw Error(errorMessages);
	}

	const data = validation.data;

	const existingUser = await userRepo.findOneBy([
		{ email: data.email },
		{ phone_number: data.phone_number },
	]);

	if (existingUser) {
		const conflictField =
			existingUser.email === data.email ? "Email" : "Phone Number";

		res.status(409).json({
			success: false,
			message: `${conflictField} is already registered`,
		});
		return;
	}

	const saltRounds = parseInt(process.env.salt_rounds) || 10;
	const hashedPassword = await bcrypt.hash(data.password, saltRounds);

	const { otp, hashedOtp } = await createOtp(saltRounds);

	await userRepo.insert({
		first_name: data.first_name,
		last_name: data.last_name,
		email: data.email,
		phone_number: data.phone_number,
		password_hash: hashedPassword,
		otp_secret: hashedOtp,
	});

	await sendVerificationEmails(data.email, otp);

	res.status(202).json({
		success: true,
		message: "OTP sent. Please verify to complete login.",
	});
};
