import { Affiliations } from "../entity/sql/Affiliations.js";
import { AffiliationsType, SURGERY_TYPE } from "../utils/dataTypes.js";
import {
	affiliationRepo,
	departmentRepo,
	roleRepo,
	permissionRepo,
} from "./repositories.js";

export const seedDatabase = async () => {
	// Seed Affiliations
	const affiliationsInDb = await affiliationRepo.find();
	let savedAffiliations: Affiliations[] = affiliationsInDb;
	if (affiliationsInDb.length === 0) {
		const affiliations = [
			{
				id: 1,
				name: "Cairo General Hospital",
				country: "Egypt",
				city: "Cairo",
				address: "123 Nile Street",
				institution_type: AffiliationsType.HOSPITAL,
			},
			{
				id: 2,
				name: "Alexandria Medical Center",
				country: "Egypt",
				city: "Alexandria",
				address: "456 Corniche Road",
				institution_type: AffiliationsType.CLINIC,
			},
			{
				id: 3,
				name: "Luxor Health Institute",
				country: "Egypt",
				city: "Luxor",
				address: "789 Temple Avenue",
				institution_type: AffiliationsType.UNIVERSITY,
			},
			{
				id: 4,
				name: "Giza Research Hospital",
				country: "Egypt",
				city: "Giza",
				address: "321 Pyramid Street",
				institution_type: AffiliationsType.HOSPITAL,
			},
		];
		savedAffiliations = await affiliationRepo.save(affiliations);
	}

	// Seed Departments
	const departmentsInDb = await departmentRepo.find();
	if (departmentsInDb.length === 0) {
		const departments = [
			{ name: "Cardiology", affiliation: savedAffiliations[1] },
			{ name: "Cardiology", affiliation: savedAffiliations[2] },
			{ name: "Orthopedics", affiliation: savedAffiliations[2] },
			{ name: "Neurology", affiliation: savedAffiliations[1] },
			{ name: "Pediatrics", affiliation: savedAffiliations[1] },
			{ name: "Oncology", affiliation: savedAffiliations[3] },
			{ name: "General Surgery", affiliation: savedAffiliations[3] },
			{ name: "Anesthesiology", affiliation: savedAffiliations[4] },
			{ name: "Anesthesiology", affiliation: savedAffiliations[4] },
			{ name: "Cardiology", affiliation: savedAffiliations[3] },
			{ name: "General Surgery", affiliation: savedAffiliations[3] },
			{ name: "Neurology", affiliation: savedAffiliations[4] },
			{ name: "Neurology", affiliation: savedAffiliations[4] },
		];
		await departmentRepo.save(departments);
	}

	// Seed Roles
	const rolesInDb = await roleRepo.find();
	if (rolesInDb.length === 0) {
		const roles = [
			{ id: 1, name: "Admin", parent: null, requiredCount: 0 },
			{ id: 2, name: "Hospital Director", parent: { id: 1 }, requiredCount: 0 },
			{ id: 3, name: "Department Head", parent: { id: 2 }, requiredCount: 0 },
			{
				id: 4,
				name: "Consultant",
				parent: { id: 3 },
				requiredSurgeryType: SURGERY_TYPE.COMPLEX,
				requiredCount: 50,
			},
			{
				id: 5,
				name: "Specialist",
				parent: { id: 4 },
				requiredSurgeryType: SURGERY_TYPE.SPECIALIZED,
				requiredCount: 100,
			},
			{
				id: 6,
				name: "Resident Doctor",
				parent: { id: 5 },
				requiredSurgeryType: SURGERY_TYPE.SUPERVISED,
				requiredCount: 150,
			},
			{
				id: 7,
				name: "Internship Doctor",
				parent: { id: 5 },
				requiredSurgeryType: SURGERY_TYPE.OBSERVED,
				requiredCount: 20,
			},
			{ id: 8, name: "Service Doctor", parent: null, requiredCount: 0 },
			{
				id: 9,
				name: "Attachment Doctor",
				parent: { id: 8 },
				requiredSurgeryType: SURGERY_TYPE.SHADOWING,
				requiredCount: 10,
			},
			{ id: 10, name: "Medical Student", parent: null, requiredCount: 0 },
			{ id: 11, name: "Nurse", parent: { id: 3 }, requiredCount: 0 },
			{ id: 12, name: "Receptionist", parent: { id: 2 }, requiredCount: 0 },
		];
		await roleRepo.save(roles);
	}

	// Seed Permissions
	const permissionsInDb = await permissionRepo.find();
	if (permissionsInDb.length === 0) {
		const permissions = [
			{ action: "manage_users" },
			{ action: "manage_roles" },
			{ action: "manage_permissions" },
			{ action: "view_reports" },
			{ action: "manage_departments" },
			{ action: "approve_complex_surgery" },
			{ action: "approve_specialized_surgery" },
			{ action: "create_complex_surgery" },
			{ action: "create_specialized_surgery" },
			{ action: "create_supervised_surgery" },
			{ action: "create_observed_surgery" },
			{ action: "create_shadowing_surgery" },
			{ action: "document_surgery" },
			{ action: "view_surgery" },
			{ action: "update_surgery_outcome" },
			{ action: "create_patient" },
			{ action: "update_patient" },
			{ action: "view_patient_records" },
			{ action: "delete_patient" },
			{ action: "create_schedule" },
			{ action: "update_schedule" },
			{ action: "view_schedule" },
			{ action: "manage_equipment" },
			{ action: "schedule_appointment" },
			{ action: "cancel_appointment" },
			{ action: "update_medical_record" },
			{ action: "view_medical_history" },
			{ action: "access_training_materials" },
			{ action: "shadow_surgery" },
			{ action: "update_patient_vitals" },
			{ action: "manage_pre_op_care" },
			{ action: "manage_post_op_care" },
			{ action: "manage_service_patients" },
			{ action: "update_service_records" },
			{ action: "submit_observations" },
			{ action: "view_observed_surgery" },
			{ action: "supervise_residents" },
			{ action: "assign_surgeons" },
			{ action: "generate_reports" },
			{ action: "manage_appointments" },
		];
		await permissionRepo.save(permissions);
	}

	// Linking Roles and Permissions based on realistic responsibilities
	const allRoles = await roleRepo.find();
	const allPermissions = await permissionRepo.find();

	// Define a mapping of role names to the permission actions they should have.
	const rolePermissionMapping: { [roleName: string]: string[] } = {
		Admin: allPermissions.map((p) => p.action),
		"Hospital Director": [
			"manage_users",
			"manage_roles",
			"manage_permissions",
			"view_reports",
			"manage_departments",
			"generate_reports",
			"manage_equipment",
			"manage_appointments",
		],
		"Department Head": [
			"approve_complex_surgery",
			"approve_specialized_surgery",
			"assign_surgeons",
			"generate_reports",
			"manage_departments",
		],
		Consultant: [
			"create_complex_surgery",
			"create_specialized_surgery",
			"document_surgery",
			"view_surgery",
			"update_surgery_outcome",
			"access_training_materials",
		],
		Specialist: [
			"create_supervised_surgery",
			"create_observed_surgery",
			"document_surgery",
			"view_surgery",
			"update_surgery_outcome",
			"access_training_materials",
		],
		"Resident Doctor": [
			"create_supervised_surgery",
			"document_surgery",
			"view_surgery",
			"shadow_surgery",
			"update_patient_vitals",
			"access_training_materials",
			"submit_observations",
		],
		"Internship Doctor": [
			"shadow_surgery",
			"view_surgery",
			"access_training_materials",
			"submit_observations",
		],
		"Service Doctor": [
			"manage_service_patients",
			"update_service_records",
			"document_surgery",
			"view_surgery",
		],
		"Attachment Doctor": [
			"shadow_surgery",
			"view_surgery",
			"access_training_materials",
		],
		"Medical Student": [
			"access_training_materials",
			"view_surgery",
			"submit_observations",
		],
		Nurse: [
			"update_patient_vitals",
			"manage_pre_op_care",
			"manage_post_op_care",
			"update_medical_record",
			"view_medical_history",
		],
		Receptionist: [
			"create_patient",
			"update_patient",
			"view_patient_records",
			"manage_appointments",
			"schedule_appointment",
			"cancel_appointment",
		],
	};

	// Update each role with its corresponding permissions.
	for (const role of allRoles) {
		const actions = rolePermissionMapping[role.name];
		if (actions) {
			role.permissions = allPermissions.filter((perm) =>
				actions.includes(perm.action)
			);
			await roleRepo.save(role);
		}
	}

	console.log("Database seeded successfully!");
};
