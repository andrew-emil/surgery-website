import { Request, Response } from "express";
import { surgeryLogsRepo, surgeryRepo } from "../../../config/repositories.js";
import { STATUS } from "../../../utils/dataTypes.js";
import { ObjectId } from "mongodb";

interface SurgeryInterface {
	id: string;
	name: string;
	date: Date;
	status: STATUS;
	stars: number;
	icdCode: string;
	cptCode: string;
	patient_id: ObjectId;
}

export const getUserSurgeries = async (req: Request, res: Response) => {
	if (!req.user) throw Error("unauthorized");
	const userId = req.user.id;

	const surgeries = await surgeryLogsRepo.find({
		where: {
			$or: [{ "doctorsTeam.doctorId": userId }, { leadSurgeon: userId }],
		},
	});
	let names: Promise<string>[];
	if (surgeries.length > 0) {
		names = surgeries.map(async (sur) => {
			const surgeriesName = await surgeryRepo.findOne({
				where: {
					id: sur.surgeryId,
				},
				select: ["id", "name"],
			});
			return surgeriesName.name;
		});
	}
	const resolvedNames = surgeries.length > 0 ? await Promise.all(names) : [];
	const formatedSurgeries: SurgeryInterface[] = surgeries.map(
		(surgery, index) => ({
			id: surgery.id.toString(),
			name: resolvedNames[index],
			date: surgery.date,
			status: surgery.status,
			stars: surgery.stars,
			icdCode: surgery.icdCode,
			cptCode: surgery.cptCode,
			patient_id: new ObjectId(surgery.patient_details.patient_id),
		})
	);

	res.status(200).json({
		surgeries: formatedSurgeries,
	});
};
