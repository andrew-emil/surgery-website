import { Affiliations } from "../entity/sql/Affiliations.js";
import { AffiliationsType } from "../utils/dataTypes.js";
import { affiliationRepo, departmentRepo } from "./repositories.js";

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
	console.log("Database seeded successfully!");
};
