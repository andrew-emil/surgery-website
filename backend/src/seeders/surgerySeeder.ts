import { AppDataSource, MongoDataSource } from "../config/data-source.js";
import { Surgery } from "../entity/sql/Surgery.js";
import { SurgeryLog } from "../entity/mongodb/SurgeryLog.js";
import { ProcedureType } from "../entity/sql/ProcedureType.js";
import { Affiliations } from "../entity/sql/Affiliations.js";
import { Department } from "../entity/sql/departments.js";
import { SurgeryEquipment } from "../entity/sql/SurgeryEquipments.js";
import { DoctorsTeam } from "../entity/sub entity/DoctorsTeam.js";
import { PatientDetails } from "../entity/sub entity/PatientDetails.js";
import {
	PARTICIPATION_STATUS,
	STATUS,
	SURGERY_TYPE,
	OUTCOME,
	DISCHARGE_STATUS,
} from "../utils/dataTypes.js";
import { User } from "../entity/sql/User.js";
import { TrainingService } from "../service/TrainingService.js";
import { Role } from "../entity/sql/Roles.js";
import { PostSurgery } from "../entity/mongodb/PostSurgery.js";

export const seedSurgeries = async () => {
	// Initialize repositories
	const surgeryRepo = AppDataSource.getRepository(Surgery);
	const surgeryLogsRepo = MongoDataSource.getMongoRepository(SurgeryLog);
	const procedureTypeRepo = AppDataSource.getRepository(ProcedureType);
	const affiliationRepo = AppDataSource.getRepository(Affiliations);
	const departmentRepo = AppDataSource.getRepository(Department);
	const surgeryEquipmentRepo = AppDataSource.getRepository(SurgeryEquipment);
	const userRepo = AppDataSource.getRepository(User);
	const roleRepo = AppDataSource.getRepository(Role);

	// Create TrainingService instance
	const trainingService = new TrainingService(
		userRepo,
		roleRepo,
		surgeryLogsRepo
	);

	// Sample data
	const procedures = [
		{ name: "Appendectomy", category: SURGERY_TYPE.PS },
		{ name: "Cholecystectomy", category: SURGERY_TYPE.AS },
		{ name: "Hip Replacement", category: SURGERY_TYPE.PI },
		{ name: "Cataract Surgery", category: SURGERY_TYPE.O },
	];

	const equipments = [
		{ equipment_name: "Surgical Scalpel" },
		{ equipment_name: "Forceps" },
		{ equipment_name: "Surgical Scissors" },
		{ equipment_name: "Retractor" },
	];

	const hospitals = [
		{
			name: "Central Hospital",
			city: "Cairo",
			country: "Egypt",
			address: "123 Main St",
			departments: ["General Surgery", "Orthopedics", "Ophthalmology"],
		},
		{
			name: "Medical Center",
			city: "Alexandria",
			country: "Egypt",
			address: "456 Health Ave",
			departments: ["Cardiology", "Neurology", "General Surgery"],
		},
	];

	try {
		// Create procedure types
		const savedProcedures = await Promise.all(
			procedures.map((proc) => {
				const procedureType = procedureTypeRepo.create(proc);
				return procedureTypeRepo.save(procedureType);
			})
		);

		// Create equipment
		const savedEquipments = await Promise.all(
			equipments.map((equip) => {
				const equipment = surgeryEquipmentRepo.create(equip);
				return surgeryEquipmentRepo.save(equipment);
			})
		);

		// Create hospitals and departments
		for (const hospital of hospitals) {
			const { departments: deptNames, ...hospitalData } = hospital;
			const newHospital = await affiliationRepo.save(
				affiliationRepo.create(hospitalData)
			);

			// Create departments for the hospital
			await Promise.all(
				deptNames.map((deptName) =>
					departmentRepo.save(
						departmentRepo.create({
							name: deptName,
							affiliation: newHospital,
						})
					)
				)
			);
		}

		// Get some sample users (assuming they exist)
		const users = await userRepo.find({ take: 3 });
		if (users.length === 0) {
			console.log("No users found in the database. Please seed users first.");
			return;
		}

		// Create surgeries
		const allHospitals = await affiliationRepo.find({
			relations: ["departments"],
		});
		const allDepartments = await departmentRepo.find();
		const postSurgeryRepo = MongoDataSource.getMongoRepository(PostSurgery);

		// Common complications for more realistic data
		const commonComplications = [
			"Surgical site infection",
			"Post-operative bleeding",
			"Delayed wound healing",
			"Adverse reaction to anesthesia",
			"Respiratory complications",
			"Blood pressure instability",
		];

		// Create surgeries across last 6 months
		const today = new Date();
		const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);

		// Create 20 surgeries per month for the last 6 months
		for (let month = 0; month < 6; month++) {
			const currentDate = new Date(
				sixMonthsAgo.getFullYear(),
				sixMonthsAgo.getMonth() + month,
				1
			);

			for (let i = 0; i < 20; i++) {
				const surgeryDate = new Date(currentDate);
				surgeryDate.setDate(Math.floor(Math.random() * 28) + 1); // Random day in month

				const hospital =
					allHospitals[Math.floor(Math.random() * allHospitals.length)];
				const department =
					allDepartments[Math.floor(Math.random() * allDepartments.length)];
				const procedure =
					savedProcedures[Math.floor(Math.random() * savedProcedures.length)];
				const selectedEquipments = savedEquipments.slice(
					0,
					Math.floor(Math.random() * 3) + 1
				);

				// Create SQL Surgery record
				const surgery = await surgeryRepo.save(
					surgeryRepo.create({
						name: `${procedure.name} - ${surgeryDate.toLocaleDateString()}`,
						hospital,
						department,
						procedure,
						surgeryEquipments: selectedEquipments,
					})
				);

				// Create MongoDB SurgeryLog record
				const surgeryLog = new SurgeryLog();
				surgeryLog.surgeryId = surgery.id;
				surgeryLog.leadSurgeon = users[0].id;
				surgeryLog.slots = Math.floor(Math.random() * 3) + 1;
				surgeryLog.status = STATUS.COMPLETED; // All historical surgeries are completed
				surgeryLog.date = surgeryDate;
				surgeryLog.time = `${Math.floor(Math.random() * 8) + 8}:00`; // Random time between 8:00 and 16:00
				surgeryLog.cptCode = "12345";
				surgeryLog.icdCode = "A123";

				// Add patient details
				surgeryLog.patient_details = new PatientDetails(
					20 + Math.random() * 15, // BMI between 20 and 35
					["None"], // Comorbidity
					"Sample diagnosis"
				);

				// Add doctors team
				const doctorsTeam = users.map(
					(user, index) =>
						new DoctorsTeam(
							user.id,
							index + 1,
							PARTICIPATION_STATUS.APPROVED,
							"Sample notes"
						)
				);
				surgeryLog.doctorsTeam = doctorsTeam;

				// Add training credits
				surgeryLog.trainingCredits =
					await trainingService.initializeSurgeryRecords(
						doctorsTeam.map((d) => ({
							userId: d.doctorId,
							roleId: d.roleId,
						})),
						users[0].id
					);

				await surgeryLogsRepo.save(surgeryLog);

				// Create post-surgery data with varying success rates based on month
				// Success rate gradually improves over months
				const baseSuccessRate = 0.7 + month * 0.05; // 70% success rate in first month, improving by 5% each month
				const isSuccess = Math.random() < baseSuccessRate;

				const postSurgery = new PostSurgery();
				postSurgery.surgeryId = surgery.id;
				postSurgery.surgicalTimeMinutes = Math.floor(Math.random() * 120) + 60;
				postSurgery.outcome = isSuccess ? OUTCOME.SUCCESS : OUTCOME.FAILURE;

				if (!isSuccess) {
					// For failed surgeries, randomly select 1-2 complications
					const numComplications = Math.floor(Math.random() * 2) + 1;
					const selectedComplications = [...commonComplications]
						.sort(() => 0.5 - Math.random())
						.slice(0, numComplications);
					postSurgery.complications = selectedComplications.join(", ");
				}

				postSurgery.dischargeStatus =
					Math.random() < 0.6
						? DISCHARGE_STATUS.DISCHARGED
						: DISCHARGE_STATUS.OBSERVATION;
				postSurgery.caseNotes = isSuccess
					? "Procedure completed successfully. Patient recovery as expected."
					: "Procedure encountered complications. Additional monitoring required.";

				// Set creation date to match surgery date
				postSurgery.createdAt = surgeryDate;

				if (postSurgery.dischargeStatus === DISCHARGE_STATUS.DISCHARGED) {
					const dischargeDays = Math.floor(Math.random() * 5) + 1; // 1-5 days after surgery
					const dischargeDate = new Date(surgeryDate);
					dischargeDate.setDate(dischargeDate.getDate() + dischargeDays);
					postSurgery.dischargedAt = dischargeDate;
				}

				await postSurgeryRepo.save(postSurgery);
			}
		}

		console.log("Surgery and post-surgery seeding completed successfully!");
	} catch (error) {
		console.error("Error seeding surgeries:", error);
		throw error;
	}
};
