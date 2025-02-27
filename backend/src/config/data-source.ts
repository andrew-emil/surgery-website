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
import { ProcedureDetails } from "../entity/mongodb/ProcedureDetails.js";
import { SurgeryLog } from "../entity/mongodb/SurgeryLog.js";
import { Surgery } from "../entity/sql/Surgery.js";
import { SurgeryEquipmentMapping } from "../entity/sql/SurgeryEquipmentMapping.js";
import { UserAffiliations } from "../entity/sql/UserAffiliations.js";
import { Permission } from "../entity/sql/Permission.js";

export const AppDataSource = new DataSource({
	type: "mysql",
	host: "mysql",
	port: 3306,
	username: "root",
	password: "",
	database: process.env.DB_NAME,
	synchronize: process.env.environment === "development",
	logging: process.env.environment === "development",
	entities: [
		User,
		Role,
		Affiliations,
		UserAffiliations,
		AuthenticationRequest,
		Department,
		SurgeryEquipment,
		SurgeryType,
		Surgery,
		Permission,
		SurgeryEquipmentMapping,
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
	entities: [PostSurgery, ProcedureDetails, SurgeryLog],
	synchronize: process.env.environment === "development",
	logging: true,
});
