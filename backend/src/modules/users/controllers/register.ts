import { Response, Request } from "express";
import { registerSchema } from "../../../utils/zodSchemas.js";
import {
	affiliationRepo,
	departmentRepo,
	roleRepo,
	userRepo,
} from "../../../config/repositories.js";
import crypto from "crypto";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { NOTIFICATION_TYPES, USER_STATUS } from "../../../utils/dataTypes.js";
import { NotificationService } from "../../../service/NotificationService.js";
import { HashFunctions } from "../../../utils/hashFunction.js";

const notificationService = new NotificationService();
const hashFunctions = new HashFunctions()

export const register = async (req: Request, res: Response) => {
	const validation = registerSchema.safeParse(req.body);

	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const data = validation.data;
	const picture = req.file?.buffer;

	if (!picture) throw Error("Picture - required");

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

	const affiliation = await affiliationRepo.findOneBy({
		id: data.affiliationId,
	});

	if (!affiliation) throw Error("Affiliation Not Found");

	const department = await departmentRepo.findOneBy({
		id: data.departmentId,
	});
	if (!department) throw Error("Department Not Found");

	const role = await roleRepo.findOneBy({
		id: data.roleId,
	});
	if (!role) throw Error("Role Not Found");
	if (
		(role.name === "Resident Doctor" && !data.residencyLevel) ||
		(role.name !== "Resident Doctor" && data.residencyLevel)
	) {
		throw Error("Invalid credentials");
	}

	const hashedPassword = await hashFunctions.bcryptHash(data.password);
	const activationToken = crypto.randomBytes(32).toString("hex");
	const tokenExpiry = new Date();
	tokenExpiry.setHours(tokenExpiry.getHours() + 48);

	const newUser = userRepo.create({
		first_name: data.first_name,
		last_name: data.last_name,
		email: data.email,
		phone_number: data.phone_number,
		password_hash: hashedPassword,
		picture,
		affiliation,
		department,
		role,
		residencyLevel: data.residencyLevel,
		account_status: USER_STATUS.PENDING,
		first_login: true,
		activation_token: activationToken,
		token_expiry: tokenExpiry,
	});
	await userRepo.save(newUser);

	const adminId = await userRepo.findOne({
		where: {
			role: {
				name: "Admin",
			},
		},
		relations: ["role"],
		select: ["id"],
	});

	const activationLink = `${process.env.BASE_URL}/admin/approve-user?token=${activationToken}`;
	await notificationService.createNotification(
		adminId.id,
		NOTIFICATION_TYPES.USER_REGISTRATION,
		`New user registered: ${newUser.email}. 
		Please review and approve. 
		Activation link: ${activationLink.split("?")[0]}`
	);

	res.status(201).json({
		success: true,
		message: "Registration successful. Your account is pending admin approval.",
	});
};
