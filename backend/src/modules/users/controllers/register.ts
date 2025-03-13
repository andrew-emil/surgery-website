import { Response, Request } from "express";
import { registerSchema } from "../../../utils/zodSchemas.js";
import {
	affiliationRepo,
	departmentRepo,
	userRepo,
} from "../../../config/repositories.js";
import bcrypt from "bcrypt";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { Department } from "../../../entity/sql/departments.js";

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

	if (isNaN(parseInt(data.affiliationId)))
		throw Error("Invalid affiliation ID");

	const affiliation = await affiliationRepo.findOneBy({
		id: parseInt(data.affiliationId),
	});

	if (!affiliation) throw Error("Affiliation Not Found");

	let department: Department | null = null;
	if (data.departmentId) {
		department = await departmentRepo.findOneBy({
			id: parseInt(data.departmentId),
		});
		if (!department) throw Error("Department Not Found");
	}

	const saltRounds = parseInt(process.env.salt_rounds) || 10;
	const hashedPassword = await bcrypt.hash(data.password, saltRounds);

	await userRepo.insert({
		first_name: data.first_name,
		last_name: data.last_name,
		email: data.email,
		phone_number: data.phone_number,
		password_hash: hashedPassword,
		affiliation,
		department,
	});

	res.status(202).json({
		success: true,
		message: "OTP sent. Please verify to complete login.",
	});
};
