import { Response, Request } from "express";
import { registerSchema } from "../../../utils/zodSchemas.js";
import {
	affiliationRepo,
	departmentRepo,
	roleRepo,
	userRepo,
} from "../../../config/repositories.js";
import bcrypt from "bcrypt";
import { sendVerificationEmails } from "../../../utils/sendEmails.js";
import { createOtp } from "../../../utils/createOTP.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { Department } from "../../../entity/sql/departments.js";
import { UserLevel } from "../../../utils/dataTypes.js";

export const register = async (req: Request, res: Response) => {
	const validation = registerSchema.safeParse(req.body);

	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

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

	if (isNaN(parseInt(data.roleId))) throw Error("Invalid role ID");
	if (isNaN(parseInt(data.affiliationId)))
		throw Error("Invalid affiliation ID");

	const role = await roleRepo.findOneBy({ id: parseInt(data.roleId) });
	const affiliation = await affiliationRepo.findOneBy({
		id: parseInt(data.affiliationId),
	});

	if (!role) throw Error("Role Not Found");
	if (!affiliation) throw Error("Affiliation Not Found");

	let department: Department | null = null;
	if (data.departmentId) {
		department = await departmentRepo.findOneBy({
			id: parseInt(data.departmentId),
		});
		if (!department) throw Error("Department Not Found");
	}

	let residencyLevel = null;
	if (
		role.name === "Resident" &&
		(!data.residencyLevel || isNaN(parseInt(data.residencyLevel)))
	) {
		res.status(400).json({
			success: false,
			message: "Residency level is required for residents",
		});
		return;
	}

	residencyLevel = parseInt(data.residencyLevel);

	if (!Object.values(UserLevel).includes(role.name as UserLevel))
		throw Error("Invalid user level");

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
		role,
		affiliation,
		department,
		level: role.name as UserLevel,
		residencyLevel,
	});

	await sendVerificationEmails(data.email, otp);

	res.status(202).json({
		success: true,
		message: "OTP sent. Please verify to complete login.",
	});
};
