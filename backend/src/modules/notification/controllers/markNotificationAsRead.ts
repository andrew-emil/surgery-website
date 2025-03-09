import { Request, Response } from "express";
import { NotificationService } from "../../../service/NotificationService.js";

const notificationService = new NotificationService();

export const markNotificationAsRead = async (req: Request, res: Response) => {
	const { userId, notificationId } = req.body;

	if (isNaN(parseInt(notificationId)) || !userId)
		throw Error("Invalid credentails");

	await notificationService.markAsRead(parseInt(notificationId), userId);

	res.status(200).json({
		success: true,
		message: "Notification marked as read",
	});
};
