import { Response, Request } from "express";
import { loginSchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { UserService } from "../../../service/UserSevice.js";

export const login = async (req: Request, res: Response): Promise<void> => {
	const validation = loginSchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const { email, password } = validation.data;

	const userService = new UserService();

	const authResult = await userService.authenticateUser(email, password);

	if (!authResult.success) res.status(403).json(authResult);

	const otpResult = await userService.sendOtp(authResult.user);

	res.status(202).json(otpResult);
};
