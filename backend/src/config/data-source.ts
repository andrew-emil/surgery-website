import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "../entity/User";
import { Roles } from "../entity/Roles";
import { Affiliations } from "../entity/Affiliations";
import { AuthenticationRequest } from "../entity/AuthenticationRequests";
import { Department } from "../entity/departments";
import { SurgeryEquipment } from "../entity/SurgeryEquipments";
import { SurgeryType } from "../entity/SurgeryType";
import { UserAvailability } from "../entity/UserAvailability";
import { UserPermission } from "../entity/UserPermission";

export const AppDataSource = new DataSource({
	type: "mysql",
	host: "localhost",
	port: 3306,
	username: "root",
	password: "",
	database: process.env.DB_NAME as string,
	synchronize: process.env.environment === "development",
	logging: false,
	entities: [
		Users,
		Roles,
		Affiliations,
		AuthenticationRequest,
		Department,
		SurgeryEquipment,
		SurgeryType,
		UserAvailability,
		UserPermission,
	],
	migrations: [],
	subscribers: [],
});

export const MongoDataSource = new DataSource({
	type: "mongodb",
	url: process.env.MONGODB as string,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	database: "surgical_logbook",
	entities: [],
	synchronize: process.env.environment === "development",
	logging: true,
});
