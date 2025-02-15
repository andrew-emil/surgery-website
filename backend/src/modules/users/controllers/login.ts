import { Response, Request } from "express";
import { loginSchema } from "../../../utils/zodSchemas";
import { fromError } from "zod-validation-error";
import { userRepo } from "../../../config/repositories";
import bcrypt = require("bcrypt");

export const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const userInput = loginSchema.parse(req.body);

		const user = await userRepo.findOneBy({ email: userInput.email });

		if (!user) {
			res.status(401).json({ message: "Invalid credentials" });
			return;
		}

		const isMatched = await bcrypt.compare(userInput.password, user.password);

		if (!isMatched) {
			res.status(401).json({ message: "Invalid credentials" });
			return;
		}

		//TODO: Consider generating and returning a JWT token here for authentication
		//TODO: send OTP via email
		res.status(200).json({ message: "User successfully logged in" });
	} catch (error) {
		if (error instanceof Error && error.name === "ZodError") {
			const validationError = fromError(error);
			console.error(validationError.toString());
			res.status(400).json({ message: validationError.toString() });
			return;
		} else if (error instanceof Error) {
			console.error("Login error:", error); // Log the full error for debugging
			res.status(500).json({ message: "Internal server error" });
			return;
		} else {
			console.error("Unknown login error:", error);
			res.status(500).json({ message: "Internal server error" });
			return;
		}
	}
};
