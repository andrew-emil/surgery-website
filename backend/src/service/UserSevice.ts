import bcrypt from "bcrypt";
import { userRepo } from "../config/repositories.js";
import { createOtp } from "../utils/createOTP.js";
import {
	sendAccountUpdateEmail,
	sendResetEmail,
	sendVerificationEmails,
} from "../utils/sendEmails.js";
import { generateResetToken } from "../utils/generateResetToken.js";
import { User } from "../entity/sql/User.js";
import { createJWTtoken } from "../handlers/jwtHandler.js";

export class UserService {
	private MAX_FAILED_ATTEMPTS = 5;
	private LOCK_TIME_MINUTES = 60;

	async login(
		email: string,
		password: string
	): Promise<{ success: boolean; user?: User; message?: string }> {
		const user = await userRepo.findOneBy({ email });

		if (!user) return { success: false, message: "Invalid credentials" };

		// Check if account is locked
		if (user.lock_until && new Date(user.lock_until) > new Date()) {
			return {
				success: false,
				message: `Account locked. Try again after ${new Date(
					user.lock_until
				).toLocaleTimeString()}.`,
			};
		}

		// Validate password
		const isMatched = await bcrypt.compare(password, user.password_hash);
		if (!isMatched) {
			user.failed_attempts += 1;
			if (user.failed_attempts >= this.MAX_FAILED_ATTEMPTS) {
				user.lock_until = new Date(
					Date.now() + this.LOCK_TIME_MINUTES * 60 * 1000
				);
			}
			await userRepo.save(user);
			return { success: false, message: "Invalid credentials" };
		}

		// Reset failed attempts
		user.failed_attempts = 0;
		user.lock_until = null;
		await userRepo.save(user);

		return { success: true, user };
	}

	async sendOtp(user: User): Promise<{ success: boolean; message: string }> {
		const { otp, hashedOtp } = await createOtp(
			parseInt(process.env.salt_rounds) || 10
		);
		console.log("Generated OTP:", otp);

		user.otp_secret = hashedOtp;
		await userRepo.save(user);
		await sendVerificationEmails(user.email, otp);

		return {
			success: true,
			message: "OTP sent. Please verify to complete login.",
		};
	}

	async forgetPassword(email: string): Promise<void> {
		const user = await userRepo.findOneBy({ email });
		if (!user) return;

		// Generate reset token
		const { token, hashedToken } = await generateResetToken();
		user.reset_token = hashedToken;
		user.reset_token_expires = new Date(Date.now() + 60 * 60 * 1000);
		await userRepo.save(user);

		const resetURL = `${process.env.BASE_URL}/reset-password?token=${token}`;

		// Send reset email
		await sendResetEmail(email, resetURL);

		return;
	}

	async resetPassword(
		token: string,
		newPassword: string
	): Promise<{ success: boolean; message?: string }> {
		const hashedToken = await bcrypt.hash(
			token,
			parseInt(process.env.salt_rounds)
		);
		const user = await userRepo.findOneBy({ reset_token: hashedToken });

		// Validate token
		if (
			!user ||
			!user.reset_token_expires ||
			new Date(user.reset_token_expires) < new Date()
		) {
			return { success: false, message: "Invalid or expired token." };
		}

		const hashedPassword = await bcrypt.hash(
			newPassword,
			parseInt(process.env.salt_rounds)
		);
		user.password_hash = hashedPassword;
		user.reset_token = null;
		user.reset_token_expires = null;
		await userRepo.save(user);

		return { success: true, message: "Password reset successful" };
	}

	async updateAccount(user: User, data: any) {
		const saltRounds = parseInt(process.env.salt_rounds || "10", 10);
		let passwordUpdated = false;

		// Handle password update securely
		if (data.old_password && data.new_password) {
			const isPasswordCorrect = await bcrypt.compare(
				data.old_password,
				user.password_hash
			);
			if (!isPasswordCorrect)
				return { success: false, message: "Invalid credentials" };

			user.password_hash = await bcrypt.hash(data.new_password, saltRounds);
			passwordUpdated = true;
			user.token_version = (user.token_version || 0) + 1; // Invalidate old tokens
		} else if (!data.old_password && data.new_password) {
			return { success: false, message: "Invalid credentials" };
		}

		// Prepare updated fields
		const updatedUser: Partial<User> = {};
		if (data.first_name && data.first_name !== user.first_name)
			updatedUser.first_name = data.first_name;
		if (data.last_name && data.last_name !== user.last_name)
			updatedUser.last_name = data.last_name;
		if (data.email && data.email !== user.email) updatedUser.email = data.email;
		if (data.phone_number && data.phone_number !== user.phone_number)
			updatedUser.phone_number = data.phone_number;
		if (data.picture) updatedUser.picture = data.picture;

		if (Object.keys(updatedUser).length > 0 || passwordUpdated) {
			await userRepo.save({ ...user, ...updatedUser });
		}

		await sendAccountUpdateEmail(user.email, updatedUser);

		const { token, formatedSurgeries } = await createJWTtoken(user);

		return { success: true, token, formatedSurgeries };
	}

	async verify2FA(email: string, otp: string) {
		const user = await userRepo.findOne({
			where: { email },
			relations: ["role"],
		});
		if (!user) {
			return { success: false, message: "User Not Found" };
		}

		// Check if account is locked
		if (user.lock_until && new Date(user.lock_until) > new Date()) {
			return {
				success: false,
				message: `Account locked. Try again after ${new Date(
					user.lock_until
				).toLocaleTimeString()}.`,
			};
		}

		// Verify OTP
		const isOtpValid = await bcrypt.compare(otp, user.otp_secret);
		if (!isOtpValid) {
			user.failed_attempts += 1;

			// Lock account if max failed attempts are reached
			if (user.failed_attempts >= this.MAX_FAILED_ATTEMPTS) {
				user.lock_until = new Date(
					Date.now() + this.LOCK_TIME_MINUTES * 60 * 1000
				);
			}

			await userRepo.save(user);
			return { success: false, message: "Invalid credentials" };
		}

		// Reset failed attempts and clear OTP after successful verification
		user.failed_attempts = 0;
		user.lock_until = null;
		user.otp_secret = null;
		user.last_login = new Date();
		await userRepo.save(user);

		const { token, formatedSurgeries } = await createJWTtoken(user);

		return { success: true, token, formatedSurgeries };
	}
}
