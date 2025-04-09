import { Request, Response } from "express";
import { scheduleService } from "../../../config/initializeServices.js";
import { recommendStaffSchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { affiliationRepo, roleRepo } from "../../../config/repositories.js";
import { Not } from "typeorm";

export const getRecommendedStaff = async (req: Request, res: Response) => {
	const validation = recommendStaffSchema.safeParse(req.body);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const { affiliationId, departmentId, date, time } = validation.data;
	const parsedDate = new Date(date);

	const page = Math.max(1, parseInt(req.query.page as string) || 1);
	const limit = 10;
	const skip = (page - 1) * limit;

	const affiliation = await affiliationRepo.findOne({
		where: {
			id: affiliationId,
			departments: {
				id: departmentId,
			},
		},
		relations: ["departments"],
	});

	if (!affiliation) throw Error("Affiliation not found");

	const { staffRecommendation, conflictedDoctors } =
		await scheduleService.recommendStaff(affiliation, parsedDate, time);

	const conflictedStaff = conflictedDoctors.map((doctor) => ({
		id: doctor.id,
		firstName: doctor.first_name,
		lastName: doctor.last_name,
		expertise: doctor.role?.name || "Unassigned",
		conflict: true,
	}));

	const recommendedStaff = Object.entries(staffRecommendation).flatMap(
		([expertise, staff]) => staff.map((s) => ({ ...s, expertise }))
	);
	const staffMap = new Map<string, any>();

	recommendedStaff.forEach((staff) => {
		staffMap.set(staff.id, staff);
	});

	conflictedStaff.forEach((staff) => {
		const existing = staffMap.get(staff.id);
		if (existing) {
			existing.conflict = true;
		} else {
			staffMap.set(staff.id, staff);
		}
	});

	const rolesWithHierarchy = await roleRepo.find({
		where: {
			name: Not("Admin"),
		},
		// select: ["name", "hierarchyLevel"],
		order: {
			// hierarchyLevel: "ASC",
			name: "ASC",
		},
	});

	const rolePriorityMap = new Map<string, number>();
	rolesWithHierarchy.forEach((role) => {
		rolePriorityMap.set(role.name, role.hierarchyLevel);
	});
	const allStaff = Array.from(staffMap.values());

	allStaff.sort((a, b) => {
		const aLevel = rolePriorityMap.get(a.expertise) ?? Infinity;
		const bLevel = rolePriorityMap.get(b.expertise) ?? Infinity;

		if (aLevel !== bLevel) {
			return aLevel - bLevel;
		}

		const roleCompare = a.expertise.localeCompare(b.expertise);
		if (roleCompare !== 0) return roleCompare;

		const aName = `${a.lastName} ${a.firstName}`.toLowerCase();
		const bName = `${b.lastName} ${b.firstName}`.toLowerCase();
		return aName.localeCompare(bName);
	});

	const total = allStaff.length;
	const paginatedStaff = allStaff.slice(skip, skip + limit);

	res.status(200).json({
		success: true,
		recommendedStaff: paginatedStaff,
		pagination: {
			page,
			total,
			numberOfPages: Math.ceil(total / limit),
		},
	});
};
