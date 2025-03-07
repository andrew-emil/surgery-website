import { Request, Response, NextFunction } from "express";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = await getCookie("ACCESS_TOKEN", { req, res });
	console.log(token)

	if (!token) throw Error("Unauthorized");

	try {
		const decoded = jwt.verify(token as string, SECRET_KEY);
		(req as any).user = decoded;
		next();
	} catch (error) {
		res.status(401).send("Invalid or expired token");
	}
};
