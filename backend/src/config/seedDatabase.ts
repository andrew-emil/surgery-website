import { Permission } from "../entity/sql/Permission.js";
import { Role } from "../entity/sql/Roles.js";
import { AppDataSource } from "./data-source.js";
// import { permissionRepo, roleRepo } from "./repositories.js";

const seedDatabase = async () => {
    await AppDataSource.initialize()
	// Define Permissions
	const permissionsList = [
		"create_surgery",
		"edit_surgery",
		"invite_participants",
		"approve_participation",
		"assign_roles",
		"manage_hospital_settings",
		"generate_reports",
		"perform_surgery",
		"update_surgery_team",
		"access_patient_records",
		"manage_equipment",
		"approve_surgery",
	];

    const permissionRepo = AppDataSource.getRepository(Permission);

	// Insert Permissions if they don’t exist
	const existingPermissions = await permissionRepo.find();
	if (existingPermissions.length === 0) {
		const permissions = permissionsList.map((perm) => {
			const permission = new Permission();
			permission.action = perm;
			return permission;
		});
		await permissionRepo.save(permissions);
		console.log("✅ Permissions seeded successfully.");
	}

	// Fetch the permissions from the database
	const allPermissions = await permissionRepo.find();

	// Define Roles
	const rolesList = [
		{ name: "Admin", permissions: allPermissions }, // Admin gets all permissions
		{
			name: "Doctor",
			permissions: allPermissions.filter((p) =>
				[
					"create_surgery",
					"edit_surgery",
					"perform_surgery",
					"access_patient_records",
					"approve_surgery",
				].includes(p.action)
			),
		},
		{
			name: "Nurse",
			permissions: allPermissions.filter((p) =>
				["access_patient_records", "manage_equipment"].includes(p.action)
			),
		},
	];

    const roleRepo = AppDataSource.getRepository(Role);

	// Insert Roles if they don’t exist
	const existingRoles = await roleRepo.find();
	if (existingRoles.length === 0) {
		const roles = rolesList.map((roleData) => {
			const role = new Role();
			role.name = roleData.name;
			role.permissions = roleData.permissions;
			return role;
		});
		await roleRepo.save(roles);
		console.log("✅ Roles seeded successfully.");
	}

	await AppDataSource.destroy();
	console.log("🚀 Seeding completed!");
};

// Run the seeding function
seedDatabase().catch((err) => console.error("❌ Seeding failed:", err));
