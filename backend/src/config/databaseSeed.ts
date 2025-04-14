import { ProcedureType } from "../entity/sql/ProcedureType.js";
import { Role } from "../entity/sql/Roles.js";
import { SURGERY_TYPE } from "../utils/dataTypes.js";
import {
	permissionRepo,
	procedureTypeRepo,
	requirementRepo,
	roleRepo,
} from "./repositories.js";

async function seedProcedureTypes() {
	try {
		const existingCount = await procedureTypeRepo.count();
		if (existingCount > 0) {
			console.log("Procedure types already exist, skipping seeding.");
			return;
		}

		const procedureTypes = [
			{ name: "Craniotomy for Tumor", category: SURGERY_TYPE.PI },
			{ name: "Lumbar Puncture", category: SURGERY_TYPE.PS },
			{ name: "Burr Hole Drainage", category: SURGERY_TYPE.AS },
			{ name: "VP Shunt Placement", category: SURGERY_TYPE.PS },
		] as Partial<ProcedureType>[];

		await procedureTypeRepo.save(procedureTypes);
		console.log("Successfully seeded procedure types.");
	} catch (error) {
		console.error("Error seeding procedure types:", error);
		throw error;
	}
}

async function seedRoles() {
	try {
		const roleHierarchy = [
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

		const existingRoles = await roleRepo.find();
		const roleMap = new Map<string, Role>();

		// Create or update roles with proper parent relationships
		for (const { name, parent } of roleHierarchy) {
			let role = existingRoles.find((r) => r.name === name);
			const parentRole = parent ? roleMap.get(parent) : null;

			if (!role) {
				role = roleRepo.create({ name, parent: parentRole || null });
				await roleRepo.save(role);
			} else if (role.parent?.name !== parent) {
				role.parent = parentRole || null;
				await roleRepo.save(role);
			}

			roleMap.set(name, role);
		}

		console.log("Successfully processed roles.");
		return Array.from(roleMap.values());
	} catch (error) {
		console.error("Error seeding roles:", error);
		throw error;
	}
}

async function seedRequirements(savedRoles: Role[]) {
	try {
		const existingCount = await requirementRepo.count();
		if (existingCount > 0) {
			console.log("Requirements already exist, skipping seeding.");
			return;
		}

		const requirements = [
			{ role: "Consultant", procedure: "Craniotomy for Tumor", count: 50 },
			{ role: "Specialist", procedure: "VP Shunt Placement", count: 30 },
			{ role: "R1", procedure: "Lumbar Puncture", count: 20 },
			{ role: "R1", procedure: "Burr Hole Drainage", count: 15 },
		];

		const requirementEntities = [];
		for (const req of requirements) {
			const role = savedRoles.find((r) => r.name === req.role);
			const procedure = await procedureTypeRepo.findOneBy({
				name: req.procedure,
			});

			if (role && procedure) {
				requirementEntities.push(
					requirementRepo.create({
						role,
						procedure,
						requiredCount: req.count,
					})
				);
			}
		}

		await requirementRepo.save(requirementEntities);
		console.log("Successfully seeded requirements.");
	} catch (error) {
		console.error("Error seeding requirements:", error);
		throw error;
	}
}

async function seedPermissions() {
	try {
		const existingCount = await permissionRepo.count();
		if (existingCount > 0) {
			console.log("Permissions already exist, skipping seeding.");
			return;
		}

		const permissions = [
			{ action: "create surgery" },
			{ action: "delete surgery" },
			{ action: "update surgery" },
			{ action: "create equipment" },
			{ action: "perform surgery" },
			{ action: "add surgical role" },
			{ action: "access admin dashboard" },
			{ action: "create request" },
			{ action: "approve request" },
			{ action: "reject request" },
		];

		await permissionRepo.save(permissions);
		console.log("Successfully seeded permissions.");
	} catch (error) {
		console.error("Error seeding permissions:", error);
		throw error;
	}
}

async function assignRolePermissions(savedRoles: Role[]) {
	try {
		const allPermissions = await permissionRepo.find();
		const permissionActions = allPermissions.map((p) => p.action);

		const rolePermissions = {
			Admin: permissionActions,
			Consultant: [
				"create surgery",
				"delete surgery",
				"update surgery",
				"perform surgery",
				"create request",
				"approve request",
				"reject request",
				"create equipment",
				"add surgical role",
			],
			Specialist: ["perform surgery", "create request"],
		};

		for (const [roleName, requiredActions] of Object.entries(rolePermissions)) {
			const role = savedRoles.find((r) => r.name === roleName);
			if (!role) continue;

			const permissionsToAssign = allPermissions.filter((p) =>
				requiredActions.includes(p.action)
			);

			if (permissionsToAssign.length > 0) {
				role.permissions = permissionsToAssign;
				await roleRepo.save(role);
			}
		}

		console.log("Successfully assigned role permissions.");
	} catch (error) {
		console.error("Error assigning role permissions:", error);
		throw error;
	}
}

export const seedDatabase = async () => {
	try {
		await seedProcedureTypes();
		const savedRoles = await seedRoles();
		await seedRequirements(savedRoles);
		await seedPermissions();
		await assignRolePermissions(savedRoles);

		console.log("Database seeding completed successfully!");
	} catch (error) {
		console.error("Database seeding failed:", error);
		process.exit(1);
	}
};
