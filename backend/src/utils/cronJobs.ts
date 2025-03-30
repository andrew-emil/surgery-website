import cron from "node-cron";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entity/sql/User.js";
import { USER_STATUS } from "./dataTypes.js";
import { MoreThanOrEqual } from "typeorm";

export const cronJobs = cron.schedule("0 0 * * *", async () => {}, {
	scheduled: true,
});

const performDailyCleanup = async () => {
	await AppDataSource.transaction(async (sqlManger) => {
		const users = await sqlManger.find(User, {
			where: {
				account_status: USER_STATUS.INACTIVE,
			},
		});
		await sqlManger.delete(User, users);

		const todayDate = new Date();

		const pendingUser = await sqlManger.find(User, {
			where: {
				account_status: USER_STATUS.PENDING,
				token_expiry: MoreThanOrEqual(todayDate),
			},
			select: ["first_name", "last_name"],
		});
	});
};
