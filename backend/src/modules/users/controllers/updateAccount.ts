import { Request, Response } from "express";
import { updateAccountSchema } from "../../../utils/zodSchemas.js";
import { surgeryLogsRepo, userRepo } from "../../../config/repositories.js";
import bcrypt from "bcrypt";
import { User } from "../../../entity/sql/User.js";
import { jwtHandler } from "../../../handlers/jwtHandler.js";
import { In } from "typeorm";
import { sendAccountUpdateEmail } from "../../../utils/sendEmails.js";

export const updateAccount = async (req: Request, res: Response) => {
	const userInput = updateAccountSchema.parse(req.body);

	const userId = req.user?.id;
	if (!userId) throw new Error("Unauthorized");

	const user = await userRepo.findOneBy({ id: userId });
	if (!user) throw new Error("User not found");

	const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);
	let passwordUpdated = false;

	// Handle password update
	if (userInput.old_password && userInput.new_password) {
		const isPasswordCorrect = await bcrypt.compare(
			userInput.old_password,
			user.password_hash
		);
		if (!isPasswordCorrect) throw new Error("Incorrect password");

		if (userInput.new_password !== userInput.confirm_password) {
			throw new Error("Passwords do not match");
		}

		user.password_hash = await bcrypt.hash(userInput.new_password, saltRounds);
		passwordUpdated = true;
		user.token_version = (user.token_version || 0) + 1; // Invalidate old tokens
	}

	// Prepare updated fields
	const updatedUser: Partial<User> = {};
	if (userInput.first_name && userInput.first_name !== user.first_name)
		updatedUser.first_name = userInput.first_name;
	if (userInput.last_name && userInput.last_name !== user.last_name)
		updatedUser.last_name = userInput.last_name;
	if (userInput.email && userInput.email !== user.email)
		updatedUser.email = userInput.email;
	if (userInput.phone_number && userInput.phone_number !== user.phone_number)
		updatedUser.phone_number = userInput.phone_number;

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
			userRole: "admin",
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

	res.status(200).json({ message: "Account updated successfully", token });
};
