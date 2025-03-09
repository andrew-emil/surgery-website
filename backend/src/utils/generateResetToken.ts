import bcrypt from "bcrypt";
import crypto from "crypto";

export const generateResetToken = async (): Promise<{
	token: string;
	hashedToken: string;
}> => {
	const token = crypto.randomBytes(32).toString("hex");
	const hashedToken = await bcrypt.hash(
		token,
		parseInt(process.env.salt_rounds)
	);
	return { token, hashedToken };
};
