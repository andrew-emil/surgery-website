import { Request, Response, NextFunction } from "express";
import {
	affiliationRepo,
	auditTrailRepo,
	departmentRepo,
	roleRepo,
	surgeryRepo,
	userRepo,
} from "./../config/repositories.js";
import { Repository } from "typeorm";

export const auditLogger = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user?.id || "UnKnown";
		const entityName = req.baseUrl.split("/").pop();
		const entityId = req.params.id || req.body.id || null;
		const ipAddress = req.ip || req.socket.remoteAddress;
		const userAgent = req.headers["user-agent"] || "Unknown";
		const sensitiveFields = [
			"otp",
			"otp_secret",
			"password",
			"reset_token",
			"old_password",
			"new_password",
		];

		let action: string;
		let oldValue = null;
		let newValue = { ...req.body };

		const entityRepoMap: Record<string, Repository<any>> = {
			users: userRepo,
			affiliation: affiliationRepo,
			department: departmentRepo,
			roles: roleRepo,
			surgery: surgeryRepo,
		};

		const entityRepo = entityRepoMap[entityName];
		if (!entityRepo) {
			console.warn(
				`Audit log: Unknown entity '${entityName}', skipping logging.`
			);
			next();
		}

		const entityIdParsed = entityId ? parseInt(entityId) : null;

		// ✅ Fetch the old value before updating or deleting
		if (
			(req.method === "PUT" ||
				req.method === "PATCH" ||
				req.method === "DELETE") &&
			entityIdParsed
		) {
			oldValue = await entityRepo.findOne({ where: { id: entityIdParsed } });
		}

		sensitiveFields.forEach((field) => {
			if (oldValue && oldValue[field]) oldValue[field] = "[REDACTED]";
			if (newValue[field]) newValue[field] = "[REDACTED]";
		});

		switch (req.method) {
			case "POST":
				action = "INSERT";
				break;
			case "PUT":
			case "PATCH":
				action = "UPDATE";
				break;

			case "DELETE":
				action = "DELETE";
				newValue = null;
				break;

			default:
				action = "UNKNOWN";
		}

		await auditTrailRepo.save({
			userId,
			action,
			entityName,
			entityId,
			oldValue,
			newValue,
			ipAddress,
			userAgent,
		});

		next();
	} catch (error) {
		console.error("Audit Logger Error:", error);
		next(error);
	}
};
