import { Response, Request } from "express";
import { UserService } from "../../../service/UserSevice.js";


export const verify2FA = async (req: Request, res: Response) => {
	const { email, otp } = req.body;

	if (!email || !otp) throw Error("Invalid credentials");

	const userService = new UserService();
	const result = await userService.verify2FA(email, otp);

	if (!result.success) {
		res.status(400).json(result);
		return;
	}

	res.status(200).json({
		success: true,
		message: "Verification successful",
		token: result.token,
		surgeries: result.formatedSurgeries,
	});
};
