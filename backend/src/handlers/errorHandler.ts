import { NextFunction, Response, Request, ErrorRequestHandler } from "express";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(`[ERROR] ${err.name}: ${err.message}`); // Log error details

	if (err instanceof ZodError) {
		const formattedError = fromZodError(err);
		sendErrorResponse(res, 400, "Validation error", formattedError.details);
	} else if (
		err.message === "access denied" ||
		err.message === "Unauthorized"
	) {
		sendErrorResponse(res, 401, err.message);
	} else if (
		err.message.includes("Validation error") ||
		err.message.includes("Invalid")
	) {
		sendErrorResponse(res, 400, err.message);
	} else if (err.name === "QueryFailedError") {
		sendErrorResponse(res, 500, "Database query error", err.message);
	} else if (err.name === "EntityNotFoundError") {
		sendErrorResponse(res, 404, "Requested resource not found");
	} else if (err.message === "Internal server error") {
		sendErrorResponse(res, 500, err.message);
	} else {
		sendErrorResponse(res, 500, "Something went wrong", err.message);
	}
};


const sendErrorResponse = (
	res: Response,
	statusCode: number,
	message: string,
	details?: any
) => {
	res.status(statusCode).json({
		success: false,
		errorCode: statusCode,
		message,
		details,
	});
};