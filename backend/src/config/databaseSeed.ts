import { Affiliations } from "../entity/sql/Affiliations.js";
import { AffiliationsType } from "../utils/dataTypes.js";
import { affiliationRepo, departmentRepo, roleRepo } from "./repositories.js";

export const seedDatabase = async () => {
	const affiliation = await affiliationRepo.find();
	let savedAffiliations: Affiliations[];
	if (affiliation.length === 0) {
		// Seed Affiliations
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
	const department = await departmentRepo.find();
	if (department.length === 0) {
		// Seed Departments
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

	const roles = await roleRepo.find();
	if (roles.length === 0) {
		// Seed Roles with required surgeries
		const roleData = [
			{ id: 1, name: "Admin", parentId: null, requiredSurgeries: 0 },
			{ id: 2, name: "Hospital Director", parentId: 1, requiredSurgeries: 0 },
			{ id: 3, name: "Department Head", parentId: 2, requiredSurgeries: 0 },
			{ id: 4, name: "Consultant", parentId: 3, requiredSurgeries: 50 },
			{ id: 5, name: "Specialist", parentId: 4, requiredSurgeries: 100 },
			{ id: 6, name: "Resident Doctor", parentId: 5, requiredSurgeries: 150 },
			{ id: 7, name: "Internship Doctor", parentId: 5, requiredSurgeries: 20 },
			{ id: 8, name: "Service Doctor", parentId: null, requiredSurgeries: 0 },
			{ id: 9, name: "Attachment Doctor", parentId: 8, requiredSurgeries: 10 },
			{ id: 10, name: "Medical Student", parentId: null, requiredSurgeries: 0 },
			{ id: 11, name: "Nurse", parentId: 3, requiredSurgeries: 0 },
			{ id: 12, name: "Receptionist", parentId: 2, requiredSurgeries: 0 },
		];

		await roleRepo.save(roleData);
	}

	console.log("Database seeded successfully!");
};
