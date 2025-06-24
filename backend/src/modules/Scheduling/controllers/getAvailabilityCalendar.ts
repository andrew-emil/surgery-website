import { Request, Response } from "express";
import { userRepo } from "../../../config/repositories.js";
import { scheduleService } from "../../../config/initializeServices.js";

export const getAvailabilityCalendar = async (req: Request, res: Response) => {
	const { userId } = req.params;
	if (!userId) throw Error("Invalid user ID");

	const isUserExists = await userRepo.exists({
		where: {
			id: userId,
		},
	});

	if (!isUserExists) throw Error("user not found in the system");

	const availabilityCalendar =
		await scheduleService.getUserAvailabilityCalendar(userId);

	res.status(200).json({
		success: true,
		availabilityCalendar,
	});
};
