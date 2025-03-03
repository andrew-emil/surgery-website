import { Request, Response } from "express";
import { departmentRepo, surgeryTypeRepo } from "../../../config/repositories.js";
import { AppDataSource } from "../../../config/data-source.js";

export const deleteDepartment = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || isNaN(parseInt(id))) throw Error("Invalid department ID");

	const departmentId = parseInt(id);

	const department = await departmentRepo.findOne({
		where: { id: departmentId },
		relations: ["surgeryTypes"],
	});

	if (!department) throw Error("Department not found");

	await AppDataSource.transaction(async (transactionalEntityManager) => {
		if (department.surgeryTypes.length > 0) {
			await transactionalEntityManager
				.createQueryBuilder()
				.relation("Department", "surgeryTypes")
				.of(departmentId)
				.remove(department.surgeryTypes);
		}

		await transactionalEntityManager.remove(department)
	});

	res.status(204).end();
};
