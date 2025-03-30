import { ProcedureType } from "../entity/sql/ProcedureType.js";
import { Role } from "../entity/sql/Roles.js";
import { SURGERY_TYPE } from "../utils/dataTypes.js";
import {
	permissionRepo,
	procedureCategoryRepo,
	procedureTypeRepo,
	requirementRepo,
	roleRepo,
	userProgressRepo,
	userRepo,
} from "./repositories.js";

export const seedDatabase = async () => {
	// Check and seed Procedure Categories
	const existingCategories = await procedureCategoryRepo.find();
	if (existingCategories.length === 0) {
		const procedureCategories = [
			{ code: SURGERY_TYPE.O, description: "Observation" },
			{ code: SURGERY_TYPE.AS, description: "Assisted Surgery" },
			{ code: SURGERY_TYPE.PS, description: "Supervised Surgery" },
			{ code: SURGERY_TYPE.PI, description: "Independent Surgery" },
		];
		await procedureCategoryRepo.save(procedureCategories);
	}

	// Check and seed Procedure Types
	const existingProcedures = await procedureTypeRepo.find();
	if (existingProcedures.length === 0) {
		const categories = await procedureCategoryRepo.find();
		const procedureTypes = [
			{
				name: "Craniotomy for Tumor",
				category: categories.find((c) => c.code === SURGERY_TYPE.PI),
			},
			{
				name: "Lumbar Puncture",
				category: categories.find((c) => c.code === SURGERY_TYPE.PS),
			},
			{
				name: "Burr Hole Drainage",
				category: categories.find((c) => c.code === SURGERY_TYPE.AS),
			},
		].filter((p) => p.category) as Partial<ProcedureType>[];

		await procedureTypeRepo.save(procedureTypes);
	}

	// Check and seed Roles
	const existingRoles = await roleRepo.find();
	const rolesToSeed = [
		{ name: "Admin", parent: null },
		{ name: "Consultant", parent: "Admin" },
		{ name: "Specialist", parent: "Consultant" },
		{ name: "R1", parent: "Specialist" },
		{ name: "R2", parent: "R1" },
		{ name: "R3", parent: "R2" },
		{ name: "R4", parent: "R3" },
		{ name: "R5", parent: "R4" },
		{ name: "R6", parent: "R5" },
		{ name: "Internship Doctor", parent: "R6" },
	];

	const savedRoles: Role[] = [];
	for (const roleData of rolesToSeed) {
		const exists = existingRoles.find((r) => r.name === roleData.name);
		if (exists) {
			savedRoles.push(exists);
			continue;
		}

		const parent = savedRoles.find((r) => r.name === roleData.parent) || null;
		const role = roleRepo.create({
			name: roleData.name,
			parent: parent,
		});
		const savedRole = await roleRepo.save(role);
		savedRoles.push(savedRole);
	}

	// Check and seed Requirements
	const existingRequirements = await requirementRepo.find();
	if (existingRequirements.length === 0) {
		const requirements = [
			{ role: "Consultant", procedure: "Craniotomy for Tumor", count: 50 },
			{ role: "Specialist", procedure: "VP Shunt Placement", count: 30 },
			{ role: "Resident Doctor", procedure: "Lumbar Puncture", count: 20 },
			{ role: "Resident Doctor", procedure: "Burr Hole Drainage", count: 15 },
		];

		for (const req of requirements) {
			const role = savedRoles.find((r) => r.name === req.role);
			const procedure = await procedureTypeRepo.findOneBy({
				name: req.procedure,
			});

			if (role && procedure) {
				await requirementRepo.save({
					role,
					procedure,
					requiredCount: req.count,
				});
			}
		}
	}

	// Check and seed Permissions
	const existingPermissions = await permissionRepo.find();
	if (existingPermissions.length === 0) {
		const permissions = [
			{ action: "surgery:create:PI" },
			{ action: "surgery:supervise:PS" },
			{ action: "surgery:assist:AS" },
			{ action: "surgery:observe:O" },
			{ action: "patient:discharge" },
			{ action: "record:complications" },
		];
		await permissionRepo.save(permissions);
	}

	// Update role permissions if not set
	const allPermissions = await permissionRepo.find();
	const rolePermissions = {
		Consultant: ["surgery:create:PI", "surgery:supervise:PS"],
		Specialist: ["surgery:create:PI", "surgery:supervise:PS"],
		"Resident Doctor": ["surgery:assist:AS", "surgery:observe:O"],
		"Internship Doctor": ["surgery:observe:O"],
	};

	for (const [roleName, permActions] of Object.entries(rolePermissions)) {
		const role = savedRoles.find((r) => r.name === roleName);
		if (role && (!role.permissions || role.permissions.length === 0)) {
			role.permissions = allPermissions.filter((p) =>
				permActions.includes(p.action)
			);
			await roleRepo.save(role);
		}
	}

	// Seed Training Progress only if empty
	const existingProgress = await userProgressRepo.count();
	if (existingProgress === 0) {
		const users = await userRepo.find();
		const procedures = await procedureTypeRepo.find();

		for (const user of users) {
			await userProgressRepo.save(
				procedures.map((p) => ({
					user,
					procedure: p,
					completedCount: Math.floor(Math.random() * 10),
					lastPerformed: new Date(),
				}))
			);
		}
	}

	console.log("Database seeding completed!");
};
