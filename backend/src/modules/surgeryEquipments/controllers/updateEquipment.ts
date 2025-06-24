import { Request, Response } from "express";
import { AppDataSource } from "../../../config/data-source.js";
import { SurgeryEquipment } from "../../../entity/sql/SurgeryEquipments.js";
import { z } from "zod";
import { sanitizeString } from "../../../utils/sanitizeString.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { validateSchema } from "../../../utils/validateSchema.js";

const updateEquipmentSchema = z.object({
	name: z.string().min(2).max(255).transform(sanitizeString).optional(),
	photo: z
		.string()
		.optional()
		.refine((val) => !val || /^data:image\/(png|jpeg|jpg);base64,/.test(val), {
			message: "Image must be in JPEG or PNG format",
		})
		.transform((val) =>
			val ? Buffer.from(val.split(",")[1], "base64") : undefined
		),
});

export const updateEquipment = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	if (isNaN(id)) throw Error("Invalid ID format");

	const { name, photo } = validateSchema(updateEquipmentSchema, req.body);

	await AppDataSource.transaction(async (manager) => {
		const equipment = await manager.findOne(SurgeryEquipment, {
			where: { id },
			lock: { mode: "pessimistic_write" },
		});

		if (!equipment) {
			throw new Error("Equipment not found");
		}

		// Check for duplicate name
		if (name && name !== equipment.equipment_name) {
			const existing = await manager.count(SurgeryEquipment, {
				where: { equipment_name: name },
			});

			if (existing > 0) {
				res.status(409).json({
					success: false,
					message: "Equipment name already exists",
				});
				return;
			}
		}

		// Update fields
		equipment.equipment_name = name || equipment.equipment_name;
		equipment.photo = photo || equipment.photo;

		await manager.save(equipment);
	});

	res.status(200).json({
		success: true,
		message: "Equipment updated successfully",
	});
};
