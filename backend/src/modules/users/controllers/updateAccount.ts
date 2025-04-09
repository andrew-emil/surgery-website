import { Request, Response } from "express";
import { updateAccountSchema } from "../../../utils/zodSchemas.js";
import { userRepo } from "../../../config/repositories.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { userService } from "../../../config/initializeServices.js";

export const updateAccount = async (req: Request, res: Response) => {
	// #swagger.tags = ['Users']
	const userId = req.user?.id;
	if (!userId) throw Error("unauthorized");

	const validation = updateAccountSchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const data = validation.data;

	const user = await userRepo.findOneBy({ id: userId });
	if (!user) throw Error("User Not Found");

	const result = await userService.updateAccount(user, data);

	if (!result.success) {
		res.status(400).json({ success: false, message: result.message });
		return;
	}

	res.status(200).json({
		success: true,
		message: "Account updated successfully",
		token: result.token,
	});
};
