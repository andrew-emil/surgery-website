import { Request, Response } from "express";
import {
	affiliationRepo,
	postSurgeryRepo,
	ratingRepo,
	surgeryLogsRepo,
	surgeryRepo,
	surgeryTypeRepo,
	userRepo,
} from "../../../config/repositories.js";
import { STATUS } from "../../../utils/dataTypes.js";
import { PostSurgery } from "../../../entity/mongodb/PostSurgery.js";
import { Rating } from "../../../entity/mongodb/Rating.js";
import { In } from "typeorm";

export const getSurgery = async (req: Request, res: Response) => {
	const surgeryId = parseInt(req.params.id);
	if (isNaN(surgeryId)) throw Error("Invalid surgery ID");

	const surgery = await surgeryRepo.findOne({
		where: { id: surgeryId },
		relations: ["surgery_type", "hospital"],
	});
	if (!surgery) throw Error("Surgery Not Found");

	const [surgeryLog, surgeryTypeData, hospital] = await Promise.all([
		surgeryLogsRepo.findOne({
			where: { surgeryId },
			select: [
				"id",
				"performedBy",
				"date",
				"time",
				"surgicalTimeMinutes",
				"cptCode",
				"icdCode",
				"patient_details",
			],
		}),

		surgeryTypeRepo.findOneBy({ id: surgery.surgery_type.id }),
		affiliationRepo.findOneBy({ id: surgery.hospital.id }),
	]);
	if (!surgeryLog || !surgeryTypeData || !hospital)
		throw Error("Surgery Not Found");

	let postSurgery: null | PostSurgery = null;
	let rating: null | Rating[] = null;
	let averageRating: number | null = null;
	let doctors = [];

	console.log("Surgery Log from DB:", JSON.stringify(surgeryLog, null, 2));

	if (surgeryLog?.performedBy && surgeryLog.performedBy.length > 0) {
		const doctorIds = surgeryLog.performedBy.map((p) => p.doctorId);
		const doctorDetails =
			doctorIds.length > 0
				? await userRepo.find({
						where: { id: In(doctorIds) },
						select: ["id", "first_name", "last_name", "email", "role"],
				  })
				: [];
		doctors = surgeryLog.performedBy.map(({ doctorId, role }) => {
			const doctorInfo = doctorDetails.find((d) => d.id === doctorId);
			return {
				id: doctorId,
				name: doctorInfo
					? `${doctorInfo.first_name} ${doctorInfo.last_name}`
					: "Unknown Doctor",
				email: doctorInfo?.email || "N/A",
				role: doctorInfo?.role || "N/A",
				surgicalRole: role,
			};
		});
	}

	if (surgeryLog.status == STATUS.COMPLETED) {
		[postSurgery, rating] = await Promise.all([
			postSurgeryRepo.findOneBy({ surgeryId }),
			ratingRepo.findBy({ surgeryId }),
		]);

		if (rating && rating.length > 1) {
			const rawAverage =
				rating.reduce((sum, r) => sum + (r.stars || 0), 0) / rating.length;
			averageRating = Math.max(1, Math.min(5, Math.round(rawAverage)));
		}
	}

	res.status(200).json({
		success: true,
		department: surgeryTypeData.departments,
		surgeryType: surgeryTypeData.name,
		surgeryLog: {
			date: surgeryLog.date,
			time: surgeryLog.time,
			surgicalTimeMinutes: surgeryLog.surgicalTimeMinutes,
			cptCode: surgeryLog.cptCode,
			icdCode: surgeryLog.icdCode,
		},
		patient: surgeryLog.patient_details,
		postSurgery,
		rating,
		averageRating,
		doctors,
		hospital,
	});
};
