import { Request, Response } from "express";
import { surgeryEquipmentRepo } from "../../../config/repositories.js";
import { sanitizeString } from "../../../utils/sanitizeString.js";

export const addSurgeryEquipment = async (req: Request, res: Response) => {
	//if (!req.file) throw Error("Invalid credentails");

	const name = req.body.name;
	const photo = req.file?.buffer;
	if (!name) throw Error("Invalid credentails");

	const sanitizedName = sanitizeString(name);

	const exisitingEquipment = await surgeryEquipmentRepo.findOneBy({
		equipment_name: sanitizedName,
	});

	if (exisitingEquipment) {
		res.status(409).json({
			success: false,
			message: "Equipment already exists",
		});
		return;
	}

	const newEquipment = surgeryEquipmentRepo.create({
		equipment_name: sanitizedName,
		photo: photo ? photo : null,
	});

	await surgeryEquipmentRepo.save(newEquipment);

	res.status(201).json({
		success: true,
		message: "Equipment added successfully",
	});
};
