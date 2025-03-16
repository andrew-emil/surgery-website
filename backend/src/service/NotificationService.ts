import { notificationRepo } from "../config/repositories.js";
import { NOTIFICATION_TYPES } from "../utils/dataTypes.js";
import { userRepo } from "../config/repositories.js";
import { Notification } from "../entity/sql/Notification.js";
import { io } from "../server.js";
import { mail, sender } from "../config/nodeMailerConfig.js";
import { NOTIFICATION_EMAIL } from "../utils/emailTemplate.js";

export class NotificationService {

	private async sendNotificationEmail(to: string, message: string) {
		const response = await mail.sendMail({
			from: sender,
			to,
			subject: "New Notification",
			html: NOTIFICATION_EMAIL.replace("{message}", message),
			sandbox: true,
		});
		console.log("Notification email sent successfully", response);
	}

	async createNotification(
		userId: string,
		type: NOTIFICATION_TYPES,
		message: string
	): Promise<Notification> {
		const user = await userRepo.findOneBy({ id: userId });
		if (!user) throw Error("User Not Found");

		const notification = notificationRepo.create({
			type,
			message,
			user,
		});
		const savedNotification = await notificationRepo.save(notification);

		io.emit(`notification:${userId}`, savedNotification);

		if (user.email) await this.sendNotificationEmail(user.email, message);

		return savedNotification;
	}

	async getUserNotifications(
		userId: string
	): Promise<{ notifications: Notification[]; unreadCount: number }> {
		const notifications = await notificationRepo.find({
			where: { user: { id: userId } },
			order: { createdAt: "DESC" },
		});

		const unreadCount = notifications.filter((n) => !n.read).length;

		return { notifications, unreadCount };
	}

	async markAsRead(notificationId: number, userId: string): Promise<boolean> {
		const notification = await notificationRepo.findOne({
			where: { id: notificationId },
			relations: ["user"],
		});

		if (!notification) throw Error("Notification Not Found");
		if (notification.user.id !== userId) throw Error("Unauthorized");

		notification.read = true;
		await notificationRepo.save(notification);
		return true;
	}
}
