import { AppDataSource } from "./data-source";
import { Repository } from "typeorm";

import { Users } from "../entity/User";
import { Roles } from "../entity/Roles";
import { Affiliations } from "../entity/Affiliations";
import { AuthenticationRequest } from "../entity/AuthenticationRequests";
import { Department } from "../entity/departments";
import { SurgeryEquipment } from "../entity/SurgeryEquipments";
import { SurgeryType } from "../entity/SurgeryType";
import { UserAvailability } from "../entity/UserAvailability";
import { UserPermission } from "../entity/UserPermission";

// Export repositories for all entities
export let userRepo: Repository<Users>;
export let roleRepo: Repository<Roles>;
export let affiliationRepo: Repository<Affiliations>;
export let authenticationRequestRepo: Repository<AuthenticationRequest>;
export let departmentRepo: Repository<Department>;
export let surgeryEquipmentRepo: Repository<SurgeryEquipment>;
export let surgeryTypeRepo: Repository<SurgeryType>;
export let userAvailabilityRepo: Repository<UserAvailability>;
export let userPermissionRepo: Repository<UserPermission>;


export const initializeSQLRepositories = () => {
	userRepo = AppDataSource.getRepository(Users);
	roleRepo = AppDataSource.getRepository(Roles);
	affiliationRepo = AppDataSource.getRepository(Affiliations);
	authenticationRequestRepo = AppDataSource.getRepository(
		AuthenticationRequest
	);
	departmentRepo = AppDataSource.getRepository(Department);
	surgeryEquipmentRepo = AppDataSource.getRepository(SurgeryEquipment);
	surgeryTypeRepo = AppDataSource.getRepository(SurgeryType);
	userAvailabilityRepo = AppDataSource.getRepository(UserAvailability);
	userPermissionRepo = AppDataSource.getRepository(UserPermission);
};