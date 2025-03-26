import { Request, Response } from "express";
import { updateSurgerySchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { surgeryLogsRepo } from "../../../config/repositories.js";
import { AppDataSource } from "../../../config/data-source.js";
import { Surgery } from "../../../entity/sql/Surgery.js";
import { In } from "typeorm";
import { Affiliations } from "./../../../entity/sql/Affiliations.js";
import { Department } from "../../../entity/sql/departments.js";
import { SurgeryEquipment } from "../../../entity/sql/SurgeryEquipments.js";

export const updateSurgery = async (req: Request, res: Response) => {
	const validation = updateSurgerySchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const {
		surgeryId,
		hospitalId,
		departmentId,
		surgeryEquipments,
		...updateData
	} = validation.data;

	const updatedSurgery = await AppDataSource.transaction(async (sqlManager) => {
		const surgery = await sqlManager.findOne(Surgery, {
			where: { id: surgeryId },
			relations: ["department", "hospital", "surgeryEquipments"],
			lock: { mode: "pessimistic_write" },
		});

		if (!surgery) throw new Error("Surgery not found");

		if (hospitalId) {
			const hospital = await sqlManager.findOne(Affiliations, {
				where: { id: hospitalId },
			});
			if (!hospital) throw new Error("Hospital not found");
			surgery.hospital = hospital;
		}

		// Update department relationship
		if (departmentId) {
			const department = await sqlManager.findOne(Department, {
				where: { id: departmentId },
			});
			if (!department) throw new Error("Department not found");
			surgery.department = department;
		}

		if (surgeryEquipments) {
			const equipment = await sqlManager.find(SurgeryEquipment, {
				where: {
					id: In(surgeryEquipments),
				},
			});
			if (equipment.length !== surgeryEquipments.length) {
				throw new Error("One or more equipment items not found");
			}
			surgery.surgeryEquipments = equipment;
		}

		// Merge and save changes
		const mergedSurgery = sqlManager.merge(Surgery, surgery, updateData);
		return await sqlManager.save(mergedSurgery);
	});

	const mongoUpdates = [];
	const changeTimestamp = new Date();

	if (updateData.leadSurgeon || updateData.doctorsTeam) {
		const logUpdate = {
			surgeryId: updatedSurgery.id,
			...updateData,
			updatedAt: changeTimestamp,
			updatedBy: req.user?.id || "system",
		};

		mongoUpdates.push(
			surgeryLogsRepo.updateOne(
				{ surgeryId: updatedSurgery.id },
				{ $set: logUpdate },
				{ upsert: true }
			)
		);
	}

	res.status(200).json({
		success: true,
		message: "Surgery updated successfully",
	});
};
