import { Request, Response } from "express";
import { updateAccountSchema } from "../../../utils/zodSchemas.js";
import { surgeryLogsRepo, userRepo } from "../../../config/repositories.js";
import bcrypt from "bcrypt";
import { User } from "../../../entity/sql/User.js";
import { jwtHandler } from "../../../handlers/jwtHandler.js";
import { In } from "typeorm";
import { sendAccountUpdateEmail } from "../../../utils/sendEmails.js";

export const updateAccount = async (req: Request, res: Response) => {
	const validation = updateAccountSchema.safeParse(req.body);

	if (!validation.success) {
		const errorMessages = validation.error.issues
			.map((issue) => `${issue.path.join(".")} - ${issue.message}`)
			.join(", ");

		throw Error(errorMessages);
	}

	const data = validation.data

	const userId = req.user?.id;
	if (!userId) throw Error("Unauthorized");

	const user = await userRepo.findOneBy({ id: userId });
	if (!user) throw Error("User not found");

	const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);
	let passwordUpdated = false;

	// Handle password update
	if (data.old_password && data.new_password) {
		const isPasswordCorrect = await bcrypt.compare(
			data.old_password,
			user.password_hash
		);
		if (!isPasswordCorrect) throw Error("Invalid credentials");

		user.password_hash = await bcrypt.hash(data.new_password, saltRounds);
		passwordUpdated = true;
		user.token_version = (user.token_version || 0) + 1; // Invalidate old tokens
	}

	// Prepare updated fields
	const updatedUser: Partial<User> = {};
	if (data.first_name && data.first_name !== user.first_name)
		updatedUser.first_name = data.first_name;
	if (data.last_name && data.last_name !== user.last_name)
		updatedUser.last_name = data.last_name;
	if (data.email && data.email !== user.email)
		updatedUser.email = data.email;
	if (data.phone_number && data.phone_number !== user.phone_number)
		updatedUser.phone_number = data.phone_number;

	if (Object.keys(updatedUser).length > 0 || passwordUpdated) {
		await userRepo.save({ ...user, ...updatedUser });
	}

	// Generate a new token if the password was updated
	let token: string | null = null;
	if (passwordUpdated) {
		const surgeries = await surgeryLogsRepo.findBy({
			performedBy: In([userId]),
		});

		token = jwtHandler({
			userId,
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
		});
	}

	await sendAccountUpdateEmail(user.email, updatedUser);

	res
		.status(200)
		.json({ success: true, message: "Account updated successfully", token });
};
