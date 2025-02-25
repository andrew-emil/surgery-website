import { AppDataSource, MongoDataSource } from "./data-source.js";
import { Repository } from "typeorm";

import { PostSurgery } from "../entity/mongodb/PostSurgery.js";
import { User } from "../entity/sql/User.js";
import { Role } from "../entity/sql/Roles.js";
import { Affiliations } from "../entity/sql/Affiliations.js";
import { AuthenticationRequest } from "../entity/sql/AuthenticationRequests.js";
import { Department } from "../entity/sql/departments.js";
import { SurgeryEquipment } from "../entity/sql/SurgeryEquipments.js";
import { SurgeryType } from "../entity/sql/SurgeryType.js";
import { UserPermission } from "../entity/sql/UserPermission.js";
import { ProcedureDetails } from "../entity/mongodb/ProcedureDetails.js";
import { SurgeryLog } from "../entity/mongodb/SurgeryLog.js";

// Export repositories for all entities
export let userRepo: Repository<User>;
export let roleRepo: Repository<Role>;
export let affiliationRepo: Repository<Affiliations>;
export let authenticationRequestRepo: Repository<AuthenticationRequest>;
export let departmentRepo: Repository<Department>;
export let surgeryEquipmentRepo: Repository<SurgeryEquipment>;
export let surgeryTypeRepo: Repository<SurgeryType>;
export let userPermissionRepo: Repository<UserPermission>;
export let postSurgeryRepo: Repository<PostSurgery>;
export let procedureRepo: Repository<ProcedureDetails>;
export let surgeryLogsRepo: Repository<SurgeryLog>;

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
	userPermissionRepo = AppDataSource.getRepository(UserPermission);
};

export const initializeMongoRepositories = () => {
	postSurgeryRepo = MongoDataSource.getMongoRepository(PostSurgery);
	procedureRepo = MongoDataSource.getMongoRepository(ProcedureDetails);
	surgeryLogsRepo = MongoDataSource.getMongoRepository(SurgeryLog);
};
