import { Response, Request } from "express";
import { surgeryLogsRepo, userRepo } from "../../../config/repositories.js";
import bcrypt from "bcrypt";
import { JWTPayload } from "../../../utils/dataTypes.js";
import { jwtHandler } from "../../../handlers/jwtHandler.js";
import { In } from "typeorm";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 30;

export const verify2FA = async (req: Request, res: Response) => {
	const { email, otp } = req.body;

	if (!email || !otp) throw Error("Invalid credentials");

	const user = await userRepo.findOneBy({ email });
	if (!user) throw Error("User not found");

	// console.log(user.otp_secret, otp);
	const isOtpValid = await bcrypt.compare(otp, user.otp_secret);
	if (!isOtpValid) {
		user.failed_attempts += 1;

		if (user.failed_attempts >= MAX_FAILED_ATTEMPTS) {
			user.lock_until = new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000);
		}

		await userRepo.save(user);
		throw Error("Invalid credentials");
	}

	user.failed_attempts = 0;
	user.lock_until = null;
	user.otp_secret = null;
	user.last_login = new Date(Date.now());
	await userRepo.save(user);

	const surgeries = await surgeryLogsRepo.find({
		where: {
			performedBy: In([user.id]),
		},
	});

	const payload: JWTPayload = {
		userId: user.id,
		userRole: user.role?.name || null,
		name: `${user.first_name} ${user.last_name}`,
		tokenVersion: user.token_version,
		surgeries: surgeries.map((surgery) => ({
			id: surgery.id.toString(),
			date: surgery.date,
			status: surgery.status,
			stars: surgery.stars,
			icdCode: surgery.icdCode,
			cptCode: surgery.cptCode,
			patient_id: surgery.patient_details.patient_id,
		})),
	};

	const token = jwtHandler(payload);

	res
		.status(200)
		.json({ success: true, message: "Verification successful", token });
};
