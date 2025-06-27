import { Request, Response } from "express";
import { z } from "zod";
import { surgeryEquipmentRepo } from "../../../config/repositories.js";
import { sanitizeString } from "../../../utils/sanitizeString.js";
import { validateSchema } from "../../../utils/validateSchema.js";

const addEquipmentSchema = z.object({
	name: z.string().min(2).max(255).transform(sanitizeString),
	photo: z
		.string()
		.refine((val) => !val || /^data:image\/(png|jpeg|jpg);base64,/.test(val), {
			message: "Image must be in JPEG or PNG format",
		})
		.transform((val) =>
			val ? Buffer.from(val.split(",")[1], "base64") : undefined
		),
});

export const addSurgeryEquipment = async (req: Request, res: Response) => {
	const { name, photo } = validateSchema(addEquipmentSchema, req.body);

	const existingEquipment = await surgeryEquipmentRepo.findOneBy({
		equipment_name: name,
	});

	if (existingEquipment) throw Error("Equipment already exists");

	const newEquipment = surgeryEquipmentRepo.create({
		equipment_name: name,
		photo,
	});

	await surgeryEquipmentRepo.save(newEquipment);

	res.status(201).json({
		success: true,
		message: "Equipment added successfully",
		equipment: newEquipment,
	});
};
