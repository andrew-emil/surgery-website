import { Request, Response } from "express";
import {
	notificationRepo,
	ratingRepo,
	surgeryLogsRepo,
} from "../../../config/repositories.js";
import { AppDataSource } from "../../../config/data-source.js";
import { User } from "../../../entity/sql/User.js";
import { USER_STATUS } from "../../../utils/dataTypes.js";
import { AuthenticationRequest } from "../../../entity/sql/AuthenticationRequests.js";
import { UserProgress } from "../../../entity/sql/UserProgress.js";

export const deleteAccount = async (req: Request, res: Response) => {
	const userId = req.user.id;

	if (!userId) throw new Error("Unauthorized");

	await AppDataSource.transaction(async (sqlManager) => {
		const user = await sqlManager.findOne(User, {
			where: {
				id: userId,
				account_status: USER_STATUS.ACTIVE,
			},
		});

		if (!user) throw Error("User not found");

		const [authRequests, notifications, userProgress] = await Promise.all([
			sqlManager.find(AuthenticationRequest, {
				where: [{ trainee: user }, { consultant: user }],
			}),
			notificationRepo.find({ where: { user } }),
			sqlManager.find(UserProgress, { where: { user } }),
		]);

		await Promise.all([
			sqlManager.remove(AuthenticationRequest, authRequests),
			sqlManager.remove(notificationRepo.metadata.target, notifications),
			sqlManager.remove(UserProgress, userProgress),
		]);

		await sqlManager.delete(User, userId);
	});

	await ratingRepo.deleteMany({ userId });

	await surgeryLogsRepo.bulkWrite([
		{
			updateMany: {
				filter: { leadSurgeon: userId },
				update: { $unset: { leadSurgeon: "" } } as any,
			},
		},

		{
			updateMany: {
				filter: { "doctorsTeam.doctorId": userId },
				update: {
					$pull: {
						doctorsTeam: {
							doctorId: userId,
						},
					},
				} as any,
			},
		},
	]);

	res.status(204).end();
};
