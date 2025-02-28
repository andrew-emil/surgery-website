import { Response, Request } from "express";
import { loginSchema } from "../../../utils/zodSchemas.js";
import { fromError } from "zod-validation-error";
import { userRepo } from "../../../config/repositories.js";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../../config/data-source.js";
import { sendVerificationEmails } from "../../../utils/sendEmails.js";
import { createOtp } from "../../../utils/createOTP.js";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 30;

export const login = async (req: Request, res: Response): Promise<void> => {
	const queryRunner = AppDataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();

	const userInput = loginSchema.parse(req.body);

	const user = await userRepo.findOneBy({ email: userInput.email });

	if (!user) throw Error("Invalid credentials");

	if (user.lock_until && new Date(user.lock_until) > new Date()) {
		res.status(403).json({
			error: `Account locked. Try again after ${new Date(
				user.lock_until
			).toLocaleTimeString()}.`,
		});
		return;
	}

	const isMatched = await bcrypt.compare(
		userInput.password,
		user.password_hash
	);

	if (!isMatched) {
		user.failed_attempts += 1;
		if (user.failed_attempts >= MAX_FAILED_ATTEMPTS) {
			user.lock_until = new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000);
		}
		await queryRunner.manager.save(user);
		await queryRunner.commitTransaction();
		throw Error("Invalid credentials");
	}

	if (user.failed_attempts > 0 || user.lock_until) {
		user.failed_attempts = 0;
		user.lock_until = null;
		await queryRunner.manager.save(user);
	}

	const { otp, hashedOtp } = await createOtp(
		parseInt(process.env.salt_rounds) || 10
	);

	user.otp_secret = hashedOtp;
	await userRepo.save(user);
	await sendVerificationEmails(userInput.email, otp);

	await queryRunner.commitTransaction();
	await queryRunner.release();
	res
		.status(202)
		.json({ message: "OTP sent. Please verify to complete login." });
};
