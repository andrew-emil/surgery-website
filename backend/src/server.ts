require('dotenv').config()

import express from 'express';
import { Application } from "express";
import morgan from 'morgan';
import usersRoutes from './modules/users/users.routes';
import { notFoundHandler } from './handlers/notFoundHandler';
import { AppDataSource } from './config/data-source';
import { initializeSQLRepositories } from './config/repositories';
import { errorMiddleware } from './middlewares/errorMiddleware';


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
		await AppDataSource.initialize();
		console.log("connected to database successfully");

		// Initialize repositories
		initializeSQLRepositories();

		// await MongoDataSource.initialize();
		// console.log("Connected to MongoDB database successfully");

		app.listen(port, () => {
			console.log(`app listening on port: ${port}`);
		});
	} catch (error) {
		console.error("Error during data source initialization:", error);
		process.exit(1); // Exit the process if database connection fails
	}
};

//start the server
startServer();

app.use(errorMiddleware);