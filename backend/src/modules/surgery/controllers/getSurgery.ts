import { Request, Response } from "express";
import {
	affiliationRepo,
	departmentRepo,
	postSurgeryRepo,
	ratingRepo,
	surgeryLogsRepo,
	surgeryRepo,
	userRepo,
} from "../../../config/repositories.js";
import { PARTICIPATION_STATUS, STATUS } from "../../../utils/dataTypes.js";
import { getEnhancedTeamDetails } from "../../../utils/getTeamDetails.js";
import { formatRatings } from "../../../utils/formatRating.js";
import { PostSurgery } from "../../../entity/mongodb/PostSurgery.js";

export const getSurgery = async (req: Request, res: Response) => {
	const surgeryId = parseInt(req.params.id);

	if (isNaN(surgeryId)) throw Error("Invalid surgery ID format");

	const [surgery, surgeryLog] = await Promise.all([
		surgeryRepo.findOne({
			where: { id: surgeryId },
			relations: ["hospital", "department"],
		}),
		surgeryLogsRepo.findOne({
			where: { surgeryId },
			select: [
				"date",
				"time",
				"cptCode",
				"icdCode",
				"patient_details",
				"status",
				"doctorsTeam",
			],
		}),
	]);

	if (!surgery || !surgeryLog) throw Error("Surgery record not found");

	const [hospital, department, ratings] = await Promise.all([
		affiliationRepo.findOneBy({ id: surgery.hospital.id }),
		departmentRepo.findOneBy({ id: surgery.department.id }),
		ratingRepo.find({
			where: {
				surgeryId: { $eq: surgeryId },
			},
		}),
	]);

	if (!hospital || !department)
		throw Error("Associated hospital or department not found");

	const activeParticipants = surgeryLog.doctorsTeam.filter(
		(p) => p.participationStatus !== PARTICIPATION_STATUS.PENDING
	);

	const [doctorDetails, leadSurgeon] = await Promise.all([
		getEnhancedTeamDetails(activeParticipants),
		userRepo.findOne({
			where: { id: surgeryLog.leadSurgeon },
			select: ["first_name", "last_name"],
		}),
	]);

	let postSurgery: PostSurgery = null;
	if (surgeryLog.status === STATUS.COMPLETED) {
		postSurgery = await postSurgeryRepo.findOneBy({ surgeryId });
	}

	res.status(200).json({
		success: true,

		surgeryId: surgery.id,
		metadata: {
			department: department.name,
			name: surgery.name,
			hospital: hospital.name,
			leadSurgeon: leadSurgeon
				? `${leadSurgeon.first_name} ${leadSurgeon.last_name}`
				: "Not assigned",
		},
		timeline: {
			date: surgeryLog.date,
			time: surgeryLog.time,
			status: surgeryLog.status,
		},
		medicalCodes: {
			cpt: surgeryLog.cptCode,
			icd: surgeryLog.icdCode,
		},
		team: doctorDetails,
		patient: surgeryLog.patient_details,
		outcomes: postSurgery
			? {
					duration: postSurgery.surgicalTimeMinutes,
					result: postSurgery.outcome,
					dischargeStatus: postSurgery.dischargeStatus,
			  }
			: null,
		ratings: formatRatings(ratings),
	});
};
