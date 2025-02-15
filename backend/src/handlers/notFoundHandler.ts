import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        status: "failed",
        message: "404 Not Found :(",
    });
};