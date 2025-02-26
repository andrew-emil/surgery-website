import "reflect-metadata";
import "express-async-errors";
import express, { Application } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import usersRoutes from "./modules/users/users.routes.js";
import { notFoundHandler } from "./handlers/notFoundHandler.js";
import { AppDataSource, MongoDataSource } from "./config/data-source.js";
import { errorHandler } from "./handlers/errorHandler.js";
import {
	initializeMongoRepositories,
	initializeSQLRepositories,
} from "./config/repositories.js";
import rolesRoutes from "./modules/roles/roles.routes.js";

config({ path: "./.env" });
const app: Application = express();
const port: number = parseInt(process.env.PORT as string);

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/users", usersRoutes);
app.use("/api/roles", rolesRoutes);

// 404 handler
app.use(notFoundHandler);

//errors handler
app.use(errorHandler);

const startServer = async () => {
	try {
		console.log("connected to database successfully" + process.env.DB_NAME);
		await AppDataSource.initialize();

		initializeSQLRepositories();

		await MongoDataSource.initialize();
		console.log("Connected to MongoDB database successfully");

		initializeMongoRepositories();

		app.listen(port, () => {
			console.log(`app listening on port: ${port}`);
		});
	} catch (error) {
		console.error("Error during data source initialization:", error);
		process.exit(1);
	}
};

startServer();
