import { Request, Response } from "express";
import { NotificationService } from "../../../service/NotificationService.js";

export const getNotification = async (req: Request, res: Response) => {
	const userId = req.params.userId;

	if (!userId) throw Error("Invalid User ID");

	const notificationService = new NotificationService();

	const { notifications, unreadCount } = await notificationService.getUserNotifications(userId);

	res.status(200).json({
		success: true,
		notifications,
		unreadCount,
	});
};
