import { Request, Response } from "express";
import { trainingService } from "../../../config/initializeServices.js";
import { roleRepo } from "../../../config/repositories.js";

export const getRoleRequirement = async (req: Request, res: Response) => {
	const roleName = req.user?.userRole;

	const parentRole = await roleRepo.findOne({
		where: {
			name: roleName,
		},
		relations: [
			"parent",
			"parent.requirements",
			"parent.requirements.procedure",
		],
	});

	if (!parentRole || parentRole.name == "Admin") {
		res.status(200).json({
			success: true,
			requirements: [],
		});
		return;
	}

	const requirements = await trainingService.getRequiredSurgeries(parentRole);
	res.status(200).json({
		success: true,
		requirements,
	});
};
