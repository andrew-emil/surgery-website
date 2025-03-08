import { notificationRepo } from "../config/repositories.js";
import { NOTIFICATION_TYPES } from "../utils/dataTypes.js";
import { userRepo } from "../config/repositories.js";
import { Notification } from "../entity/sql/Notification.js";
import { io } from "../server.js";

export class NotificationService {
	private notificationRepo = notificationRepo;
	private userRepo = userRepo;

	async createNotification(
		userId: string,
		type: NOTIFICATION_TYPES,
		message: string
	): Promise<Notification> {
		const user = await this.userRepo.findOneBy({ id: userId });
		if (!user) throw Error("User Not Found");

		const notification = this.notificationRepo.create({
			type,
			message,
			user,
		});
		const savedNotification = await this.notificationRepo.save(notification);

		io.emit(`notification:${userId}`, savedNotification);

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
		const notification = await notificationRepo.findOneBy({
			id: notificationId,
		});

		if (!notification) throw Error("Notification Not Found");
		if (notification.user.id !== userId) throw Error("Unauthorized");

		notification.read = true;
		await notificationRepo.save(notification);
		return true;
	}
}
