import { AppDataSource, MongoDataSource } from "../config/data-source.js";
import { seedSurgeries } from "./surgerySeeder.js";
import {
	initializeMongoRepositories,
	initializeSQLRepositories,
} from "../config/repositories.js";

const runSeeders = async () => {
	try {
		// Initialize connections
		await AppDataSource.initialize();
		await MongoDataSource.initialize();

		// Initialize repositories
		initializeSQLRepositories();
		initializeMongoRepositories();

		console.log("Running seeders...");

		// Run seeders
		await seedSurgeries();

		console.log("All seeders completed successfully!");
		process.exit(0);
	} catch (error) {
		console.error("Error running seeders:", error);
		process.exit(1);
	}
};

runSeeders();
