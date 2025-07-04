import { Request, Response } from "express";
import { surgeryEquipmentRepo } from "../../../config/repositories.js";
import { z } from "zod";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { validateSchema } from "../../../utils/validateSchema.js";

const getEquipmentSchema = z.object({
	page: z.string().regex(/^\d+$/).transform(Number).default("1"),
});

export const getSurgeryEquipments = async (req: Request, res: Response) => {
	let { page } = validateSchema(getEquipmentSchema, req.query);
	const limit = 20;

	const total = await surgeryEquipmentRepo.count();

	const totalPages = Math.ceil(total / limit);
	if (page > totalPages) page = totalPages;

	const skip = (page - 1) * limit;

	const equipments = await surgeryEquipmentRepo.find({
		order: { equipment_name: "ASC" },
		take: limit,
		skip,
	});

	res.status(200).json({
		success: true,
		equipments,
		pagination: {
			total,
			page,
			totalPages,
			limit,
		},
	});
};
