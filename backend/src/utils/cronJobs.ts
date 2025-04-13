import cron from "node-cron";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entity/sql/User.js";
import { Authentication_Request, STATUS, USER_STATUS } from "./dataTypes.js";
import { EntityManager, In, LessThan } from "typeorm";
import {
	auditTrailRepo,
	postSurgeryRepo,
	surgeryLogsRepo,
} from "../config/repositories.js";
import logger from "../config/loggerConfig.js";
import { AuthenticationRequest } from "../entity/sql/AuthenticationRequests.js";

const AUDIT_RETENTION_DAYS = 365;
const PENDING_REQUEST_EXPIRY_DAYS = 3;

export const initializeCronJobs = async () => {
	cron.schedule(
		"0 0 * * *",
		async () => {
			try {
				await AppDataSource.transaction(async (entityManager) => {
					await handleUserCleanup(entityManager);
					await handleAuditTrailCleanup();
					await handleAuthenticationRequests(entityManager);
					await handleAccountUnlocking(entityManager);
					await handlePasswordResetTokens(entityManager);
					await handleCompletedSurgeries();
				});
			} catch (error) {
				logger.error("Cron job failed:", error);
			}
		},
		{
			scheduled: true,
			timezone: "Africa/Cairo",
		}
	);
};

const handleUserCleanup = async (entityManager: EntityManager) => {
	const inactiveUsers = await entityManager.find(User, {
		where: { account_status: USER_STATUS.INACTIVE },
	});
	if (inactiveUsers.length > 0) {
		await entityManager.delete(User, inactiveUsers);
		logger.info(`Deleted ${inactiveUsers.length} inactive users`);
	}

	const expiredPendingUsers = await entityManager.find(User, {
		where: {
			account_status: USER_STATUS.PENDING,
			token_expiry: LessThan(new Date()),
		},
	});

	if (expiredPendingUsers.length > 0) {
		await entityManager.delete(User, expiredPendingUsers);
		logger.info(`Cleaned ${expiredPendingUsers.length} expired pending users`);
	}
};

const handleAuditTrailCleanup = async () => {
	const retentionDate = new Date();
	retentionDate.setDate(retentionDate.getDate() - AUDIT_RETENTION_DAYS);

	await auditTrailRepo.delete({
		timestamp: LessThan(retentionDate),
	});
	logger.info("Cleaned old audit trail entries");
};

const handleAuthenticationRequests = async (entityManager: EntityManager) => {
	const expiryDate = new Date();
	expiryDate.setDate(expiryDate.getDate() - PENDING_REQUEST_EXPIRY_DAYS);

	const expiredRequests = await entityManager.find(AuthenticationRequest, {
		where: {
			status: Authentication_Request.PENDING,
			created_at: LessThan(expiryDate),
		},
	});

	if (expiredRequests.length > 0) {
		await entityManager.update(
			AuthenticationRequest,
			{ id: In(expiredRequests.map((r) => r.id)) },
			{ status: Authentication_Request.CANCELLED }
		);
		logger.info(`Auto-rejected ${expiredRequests.length} old requests`);
	}
};

const handleAccountUnlocking = async (entityManager: EntityManager) => {
	await entityManager.update(
		User,
		{
			lock_until: LessThan(new Date()),
		},
		{
			lock_until: null,
			failed_attempts: 0,
		}
	);
	logger.info("Auto-unlocked expired user accounts");
};

const handlePasswordResetTokens = async (entityManager: EntityManager) => {
	await entityManager.update(
		User,
		{
			reset_token_expires: LessThan(new Date()),
		},
		{
			reset_token: null,
			reset_token_expires: null,
		}
	);
	logger.info("Cleaned expired password reset tokens");
};

const handleCompletedSurgeries = async () => {
	const postSurgeries = await postSurgeryRepo.find({ select: ["surgeryId"] });

	const surgeriesIds = postSurgeries.map((surgery) => surgery.surgeryId);

	if (surgeriesIds.length > 0) {
		await surgeryLogsRepo.updateMany(
			{
				surgeryId: { $in: surgeriesIds },
				status: STATUS.ONGOING,
			},
			{ $set: { status: STATUS.COMPLETED } }
		);
	}
	logger.info("updated completed surgeries records");
};
