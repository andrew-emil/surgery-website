import { Request, Response } from "express";
import { AppDataSource } from "../../../config/data-source.js";
import {
	affiliationRepo,
	departmentRepo,
	surgeryRepo,
	userRepo,
} from "../../../config/repositories.js";

export const deleteAffiliation = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || isNaN(parseInt(id))) throw Error("Invalid Affiliation ID");

	const affiliationId = parseInt(id);

	const affiliation = await affiliationRepo.findOne({
		where: { id: affiliationId },
		relations: ["users", "departments"],
	});

	if (!affiliation) throw Error("Invalid Affiliation ID");

	await AppDataSource.transaction(async (transactionManager) => {
		await transactionManager.update(
			surgeryRepo.target,
			{ hospital: affiliation },
			{ hospital: null }
		);

		await transactionManager.update(
			userRepo.target,
			{ affiliation },
			{ affiliation: null }
		);

		await transactionManager.delete(departmentRepo.target, { affiliation });

		const result = await transactionManager.delete(
			affiliationRepo.target,
			affiliationId
		);

		if (result.affected === 0) throw Error("Internal server error");
	});

	res.status(204).end();
};
