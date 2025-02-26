import { Request, Response, NextFunction } from "express";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = getCookie("token", { req, res });

	if (!token) throw new Error("Unauthorized");

	try {
		const decoded = jwt.verify(token as string, SECRET_KEY);
		(req as any).user = decoded;
		next();
	} catch (error) {
		res.status(401).send("Invalid or expired token");
	}
};
