import { NextFunction, Response, Request, ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.message === "access denied") {
		res.status(403).json({
			message: err.message,
		});
	} else if (err.message.includes("Validation error")) {
		res.status(401).json({ message: err.message });
	} else {
		res.status(400).json({ message: err.message });
	}

	next(err);
};
