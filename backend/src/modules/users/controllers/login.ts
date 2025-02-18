import { Response, Request } from "express";
import { loginSchema } from "../../../utils/zodSchemas.js";
import { fromError } from "zod-validation-error";
import { userRepo } from "../../../config/repositories.js";
import bcrypt from "bcrypt";

const MAX_FAILED_ATTEMPTS = 5;

export const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const userInput = loginSchema.parse(req.body);

		const user = await userRepo.findOneBy({ email: userInput.email });

		if (!user) {
			throw Error("Invalid credentials");
		}

		if (user.failed_attempts >= MAX_FAILED_ATTEMPTS) {
			res
				.status(403)
				.json({ error: "Account locked due to multiple failed attempts" });
			return;
		}

		const isMatched = await bcrypt.compare(
			userInput.password,
			user.password_hash
		);

		if (!isMatched) {
			user.failed_attempts += 1;
			await userRepo.save(user);
			throw Error("Invalid credentials");
		}

		user.failed_attempts = 0;
		user.otp_enabled = true;

		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		user.otp_secret = otp;
		await userRepo.save(user);
		//TODO: send OTP via email
		//send otp and verify

		//TODO: generate and returning a JWT token here for authentication
		res.status(200).json({ message: "User successfully logged in" });
	} catch (error) {
		if (error instanceof Error && error.name === "ZodError") {
			const validationError = fromError(error);
			console.error(validationError.toString());
			throw Error(validationError.toString());
		} else if (error instanceof Error) {
			console.error("Login error:", error); // Log the full error for debugging
			throw Error("Internal server error");
		} else {
			console.error("Unknown login error:", error);
			throw Error("Internal server error");
		}
	}
};
