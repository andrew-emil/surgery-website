import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "../entity/sql/User.js";
import { Role } from "../entity/sql/Roles.js";
import { Affiliations } from "../entity/sql/Affiliations.js";
import { AuthenticationRequest } from "../entity/sql/AuthenticationRequests.js";
import { Department } from "../entity/sql/departments.js";
import { SurgeryEquipment } from "../entity/sql/SurgeryEquipments.js";
import { SurgeryType } from "../entity/sql/SurgeryType.js";
import { PostSurgery } from "../entity/mongodb/PostSurgery.js";
import { SurgeryLog } from "../entity/mongodb/SurgeryLog.js";
import { Surgery } from "../entity/sql/Surgery.js";
import { Rating } from "../entity/mongodb/Rating.js";
import { AuditTrail } from "../entity/mongodb/AuditTrail.js";
import { SurgeryRequirement } from "../entity/sql/SurgeryRequirements.js";
import { Notification } from "../entity/sql/Notification.js";

export const AppDataSource = new DataSource({
	type: "mysql",
	host: "mysql",
	port: 3306,
	username: "root",
	password: "",
	database: process.env.DB_NAME,
	synchronize: true,
	logging: true,
	entities: [
		User,
		Role,
		Affiliations,
		AuthenticationRequest,
		Department,
		SurgeryEquipment,
		SurgeryType,
		Surgery,
		SurgeryRequirement,
		Notification,
	],
	subscribers: [],
});

export const MongoDataSource = new DataSource({
	type: "mongodb",
	url: process.env.MONGO_URI as string,
	useNewUrlParser: true,
	database: "surgical_logbook",
	entities: [PostSurgery, SurgeryLog, Rating, AuditTrail],
	synchronize: true,
	logging: true,
});
