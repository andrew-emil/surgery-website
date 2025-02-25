import jwt from "jsonwebtoken";
import { JWTPayload } from "../utils/dataTypes.js";

export const jwtHandler = (payload: JWTPayload): string => {
	try {
		const token: string = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		return token;
	} catch (error) {
		console.error(error);
		throw Error(error.message);
	}
};
