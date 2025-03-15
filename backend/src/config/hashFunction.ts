import bcrypt from "bcrypt";

export const bcryptHash = async (
	text: string,
	saltRounds: number
): Promise<string> => {
	const hashedText = await bcrypt.hash(text, saltRounds);
	return hashedText;
};
