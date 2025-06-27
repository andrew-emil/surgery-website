import axiosClient from "./../axiosClient";

export async function fetchNotifications(userId) {
	try {
		const { data } = await axiosClient.get(`/notification/${userId}`, {
			withCredentials: true,
		});

		return {
			notifications: data.notifications,
			unreadCount: data.unreadCount,
		};
	} catch (error) {
		console.error("Error loading notifications:", error);
		throw Error("Error loading notifications");
	}
}

export async function markNotificationAsRead(notificationId, userId) {
	try {
		await axiosClient.patch(
			"/notification",
			{ userId, notificationId },
			{ withCredentials: true }
		);
	} catch (error) {
		console.error("Error marking notification as read: ", error);
		throw Error("Error marking notification as read");
	}
}
