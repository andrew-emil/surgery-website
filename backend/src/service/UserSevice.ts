import { createOtp } from "../utils/createOTP.js";
import {
	sendAccountUpdateEmail,
	sendResetEmail,
	sendVerificationEmails,
} from "../utils/sendEmails.js";
import { User } from "../entity/sql/User.js";
import { createJWTtoken } from "../handlers/jwtHandler.js";
import { HashFunctions } from "../utils/hashFunction.js";
import { Repository } from "typeorm";
import { USER_STATUS } from "../utils/dataTypes.js";

export class UserService {
	private MAX_FAILED_ATTEMPTS = 5;
	private LOCK_TIME_MINUTES = 60;

	constructor(private userRepo: Repository<User>) {}

	async login(
		email: string,
		password: string
	): Promise<{ success: boolean; user?: User; message?: string }> {
		const user = await this.userRepo.findOneBy({
			email,
			account_status: USER_STATUS.ACTIVE,
		});

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

		const hashFunction = new HashFunctions(user.password_hash);
		// Validate password
		const isMatched = await hashFunction.compareBcryptHash(password);
		if (!isMatched) {
			user.failed_attempts += 1;
			if (user.failed_attempts >= this.MAX_FAILED_ATTEMPTS) {
				user.lock_until = new Date(
					Date.now() + this.LOCK_TIME_MINUTES * 60 * 1000
				);
			}
			await this.userRepo.save(user);
			return { success: false, message: "Invalid credentials" };
		}

		// Reset failed attempts
		user.failed_attempts = 0;
		user.lock_until = null;
		await this.userRepo.save(user);

		return { success: true, user };
	}

	async sendOtp(user: User): Promise<{ success: boolean; message: string }> {
		const { otp, hashedOtp } = await createOtp(
			parseInt(process.env.salt_rounds) || 10
		);
		console.log("Generated OTP:", otp);

		user.otp_secret = hashedOtp;

		await this.userRepo.save(user);
		// await sendVerificationEmails(user.email, otp);

		return {
			success: true,
			message: "OTP sent. Please verify to complete login.",
		};
	}

	async forgetPassword(email: string): Promise<void> {
		const user = await this.userRepo.findOneBy({ email });
		if (!user) return;

		const hashFunction = new HashFunctions();

		// Generate reset token
		const { token, hashedToken } = await hashFunction.generateResetToken();
		const todaysDate = Date.now();
		const expiryDate = todaysDate + 60 * 60 * 1000;

		user.reset_token = hashedToken;
		user.reset_token_expires = new Date(expiryDate);
		await this.userRepo.save(user);

		const resetURL = `${process.env.BASE_URL}/reset-password?token=${token}&email=${user.email}`;

		// Send reset email
		await sendResetEmail(email, resetURL);

		return;
	}

	async resetPassword(
		email: string,
		token: string,
		newPassword: string
	): Promise<{ success: boolean; message?: string }> {
		const user = await this.userRepo.findOne({
			where: { email },
		});

		if (
			!user ||
			!user.reset_token_expires ||
			Date.now() > new Date(user.reset_token_expires).getTime()
		) {
			return { success: false, message: "Invalid or expired token." };
		}
		const hashFunction = new HashFunctions(user.reset_token);
		const isMatched = hashFunction.compareBcryptHash(token);

		if (!isMatched)
			return { success: false, message: "Invalid or expired token." };

		const hashedPassword = await hashFunction.bcryptHash(newPassword);

		user.password_hash = hashedPassword;
		user.reset_token = null;
		user.reset_token_expires = null;
		await this.userRepo.save(user);

		return { success: true, message: "Password reset successful" };
	}

	async updateAccount(user: User, data: any) {
		const hashFunction = new HashFunctions(data.old_password);
		let passwordUpdated = false;

		// Handle password update securely
		if (data.old_password && data.new_password) {
			const isPasswordCorrect = await hashFunction.compareBcryptHash(
				data.new_password
			);
			if (!isPasswordCorrect)
				return { success: false, message: "Invalid credentials" };

			user.password_hash = await hashFunction.bcryptHash(data.new_password);
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
			await this.userRepo.save({ ...user, ...updatedUser });
		}

		// await sendAccountUpdateEmail(user.email, updatedUser);

		const token = await createJWTtoken(user, false);

		return { success: true, token };
	}

	async verify2FA(email: string, otp: string) {
		const user = await this.userRepo.findOne({
			where: { email },
			relations: ["role", "role.permissions"],
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

		const hashFunctions = new HashFunctions(user.otp_secret);
		// Verify OTP
		const isOtpValid = await hashFunctions.compareBcryptHash(otp);
		if (!isOtpValid) {
			user.failed_attempts += 1;

			// Lock account if max failed attempts are reached
			if (user.failed_attempts >= this.MAX_FAILED_ATTEMPTS) {
				user.lock_until = new Date(
					Date.now() + this.LOCK_TIME_MINUTES * 60 * 1000
				);
			}

			await this.userRepo.save(user);
			return { success: false, message: "Invalid credentials" };
		}

		const firstLogin = user.last_login === null ? true : false;

		// Reset failed attempts and clear OTP after successful verification
		user.failed_attempts = 0;
		user.lock_until = null;
		user.otp_secret = null;
		user.last_login = new Date();
		await this.userRepo.save(user);

		const token = await createJWTtoken(user, firstLogin);

		return { success: true, token };
	}
}
