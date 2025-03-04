import { Request, Response, NextFunction } from "express";
import { auditTrailRepo } from "./../config/repositories.js";

export const auditLogger = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const userId = req.user?.id || "UnKnown";
	const entityName = req.baseUrl.split("/").pop();
	const entityId = req.params.id || null;
	const ipAddress = req.ip || req.socket.remoteAddress;
	const userAgent = req.headers["user-agent"] || "Unknown";
	const sensitiveFields = ["otp", "otp_secret", "password", "reset_token"];
	const requestBody = { ...req.body };

	let action: string;
	let oldValue = null;

	sensitiveFields.forEach((field) => {
		if (requestBody[field]) requestBody[field] = "[REDACTED]";
	});

	let newValue = requestBody;

	switch (req.method) {
		case "POST":
			action = "INSERT";
			break;
		case "PUT":
		case "PATCH":
			action = "UPDATE";
			if (entityId) {
				oldValue = await auditTrailRepo.findOneBy({ id: parseInt(entityId) });
			}
			break;

		case "DELETE":
			action = "DELETE";
			if (entityId) {
				oldValue = await auditTrailRepo.findOneBy({
					id: parseInt(entityId),
				});
			}
			newValue = null;
			break;

		default:
			next();
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
};
