import { AppDataSource, MongoDataSource } from "./data-source.js";
import { Repository } from "typeorm";

import { PostSurgery } from "../entity/mongodb/PostSurgery.js";
import { User } from "../entity/sql/User.js";
import { Role } from "../entity/sql/Roles.js";
import { Affiliations } from "../entity/sql/Affiliations.js";
import { AuthenticationRequest } from "../entity/sql/AuthenticationRequests.js";
import { Department } from "../entity/sql/departments.js";
import { Notification } from "../entity/sql/Notification.js";
import { SurgeryEquipment } from "../entity/sql/SurgeryEquipments.js";
import { SurgeryType } from "../entity/sql/SurgeryType.js";
import { SurgeryLog } from "../entity/mongodb/SurgeryLog.js";
import { Rating } from "../entity/mongodb/Rating.js";
import { AuditTrail } from "../entity/mongodb/AuditTrail.js";
import { Surgery } from "../entity/sql/Surgery.js";
import { SurgeryRequirement } from "../entity/sql/SurgeryRequirements.js";

// Export repositories for all entities
export let userRepo: Repository<User>;
export let roleRepo: Repository<Role>;
export let affiliationRepo: Repository<Affiliations>;
export let authenticationRequestRepo: Repository<AuthenticationRequest>;
export let departmentRepo: Repository<Department>;
export let surgeryEquipmentRepo: Repository<SurgeryEquipment>;
export let surgeryTypeRepo: Repository<SurgeryType>;
export let surgeryRepo: Repository<Surgery>;
export let surgeryReqRepo: Repository<SurgeryRequirement>;
export let notificationRepo: Repository<Notification>;

export let auditTrailRepo: Repository<AuditTrail>;
export let postSurgeryRepo: Repository<PostSurgery>;
export let surgeryLogsRepo: Repository<SurgeryLog>;
export let ratingRepo: Repository<Rating>;

export const initializeSQLRepositories = () => {
	userRepo = AppDataSource.getRepository(User);
	roleRepo = AppDataSource.getRepository(Role);
	affiliationRepo = AppDataSource.getRepository(Affiliations);
	authenticationRequestRepo = AppDataSource.getRepository(
		AuthenticationRequest
	);
	departmentRepo = AppDataSource.getRepository(Department);
	surgeryEquipmentRepo = AppDataSource.getRepository(SurgeryEquipment);
	surgeryTypeRepo = AppDataSource.getRepository(SurgeryType);
	surgeryRepo = AppDataSource.getRepository(Surgery);
	surgeryReqRepo = AppDataSource.getRepository(SurgeryRequirement);
	notificationRepo = AppDataSource.getRepository(Notification);
};

export const initializeMongoRepositories = () => {
	postSurgeryRepo = MongoDataSource.getMongoRepository(PostSurgery);
	surgeryLogsRepo = MongoDataSource.getMongoRepository(SurgeryLog);
	ratingRepo = MongoDataSource.getMongoRepository(Rating);
	auditTrailRepo = MongoDataSource.getMongoRepository(AuditTrail);
};
