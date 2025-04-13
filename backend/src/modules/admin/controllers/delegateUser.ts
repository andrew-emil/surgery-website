import { Request, Response } from "express";
import { z } from "zod";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { AppDataSource } from "../../../config/data-source.js";
import { User } from "../../../entity/sql/User.js";
import { Role } from "../../../entity/sql/Roles.js";

const delegateUserSchema = z.object({
	userId: z.string(),
	roleId: z.string().refine((id) => !isNaN(parseInt(id)), {
		message: "Invalid role Id",
	}),
});

export const delegateUser = async (req: Request, res: Response) => {
	const validation = delegateUserSchema.safeParse(req.params);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const { userId, roleId } = validation.data;
	const parsedRoleId = parseInt(roleId);

	await AppDataSource.transaction(async (sqlManager) => {
		const user = await sqlManager.findOne(User, {
			where: {
				id: userId,
			},
			relations: ["role", "role.children"],
		});

		if (!user) throw Error("User not found");

		const role = await sqlManager.findOne(Role, {
			where: {
				id: parsedRoleId,
			},
			relations: ["children"],
		});

		if (!role || !role.children) {
			res.status(400).json({
				message: "can't delegate, User in the lowest hierarchy",
			});
			return;
		}

        
	});
};
