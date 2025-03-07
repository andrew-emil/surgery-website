import "reflect-metadata";
import "express-async-errors";
import express, { Application } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRoutes from "./modules/users/users.routes.js";
import { notFoundHandler } from "./handlers/notFoundHandler.js";
import { AppDataSource, MongoDataSource } from "./config/data-source.js";
import { errorHandler } from "./handlers/errorHandler.js";
import {
	initializeMongoRepositories,
	initializeSQLRepositories,
} from "./config/repositories.js";
import rolesRoutes from "./modules/roles/roles.routes.js";
import departmentRoutes from "./modules/department/department.routes.js";
import surgeryRoutes from "./modules/surgery/surgery.routes.js";
import affiliationRoutes from "./modules/affiliations/affiliations.routes.js";

config({ path: "./.env" });
const app: Application = express();
const port: number = parseInt(process.env.PORT as string);

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
	cors({
		origin: "*", // Allow frontend to access API
		methods: "GET,POST,PUT,DELETE,PATCH",
		credentials: true, // Allow cookies or authentication headers
	})
);

//routes
app.use("/api/users", usersRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/surgery", surgeryRoutes);
app.use("/api/affiliation", affiliationRoutes);

// 404 handler
app.use(notFoundHandler);

//errors handler
app.use(errorHandler);

const startServer = async () => {
	try {
		await AppDataSource.initialize();
		await AppDataSource.synchronize(); // Force sync
		initializeSQLRepositories();
		console.log("connected to mysql database");

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
