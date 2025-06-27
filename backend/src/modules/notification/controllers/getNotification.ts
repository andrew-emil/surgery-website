import { Request, Response } from "express";
import { notificationService } from "../../../config/initializeServices.js";

export const getNotification = async (req: Request, res: Response) => {
	const userId = req.user.id;
	if (!userId) throw Error("Unauthorized");

	const { notifications, unreadCount } =
		await notificationService.getUserNotifications(userId);

	res.status(200).json({
		success: true,
		notifications,
		unreadCount,
	});
};
