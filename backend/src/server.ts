import "reflect-metadata";
import express, { Application } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import usersRoutes from "./modules/users/users.routes.js";
import { notFoundHandler } from "./handlers/notFoundHandler.js";
import { AppDataSource } from "./config/data-source.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import {  initializeSQLRepositories } from "./config/repositories.js";

config({ path: "./.env" });
const app: Application = express();
const port: number = parseInt(process.env.PORT as string);

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/users", usersRoutes);

// 404 handler
app.use(notFoundHandler);

const startServer = async () => {
	try {
		console.log("connected to database successfully" + process.env.DB_NAME);
		await AppDataSource.initialize();

		initializeSQLRepositories();

		// await MongoDataSource.initialize();
		// console.log("Connected to MongoDB database successfully");

		// initializeMongoRepositories();

		app.listen(port, () => {
			console.log(`app listening on port: ${port}`);
		});
	} catch (error) {
		console.error("Error during data source initialization:", error);
		process.exit(1);
	}
};

startServer();

app.use(errorMiddleware);
