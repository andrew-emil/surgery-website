import { NextFunction, Response, Request, ErrorRequestHandler } from "express";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof ZodError) {
		const formattedError = fromZodError(err);
		res.status(400).json({ message: formattedError.message });
	} else if (
		err.message === "access denied" ||
		err.message === "Unauthorized"
	) {
		res.status(401).json({
			message: err.message,
		});
	} else if (
		err.message.includes("Validation error") ||
		err.message.includes("Invalid")
	) {
		res.status(400).json({ message: err.message });
	} else if (err.message === "Internal server error") {
		res.status(500).json({ message: err.message });
	} else {
		res.status(404).json({ message: err.message });
	}
};
