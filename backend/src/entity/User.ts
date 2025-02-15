import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
} from "typeorm";
import { Roles } from "./Roles";
import { Affiliations } from "./Affiliations";
import { AuthenticationRequest } from "./AuthenticationRequests";
import { UserAvailability } from "./UserAvailability";
import { UserPermission } from "./UserPermission";

@Entity()
export class Users {
	@PrimaryGeneratedColumn("uuid")
	user_id: string;

	@Column({ length: 50 })
	first_name: string;

	@Column({ length: 50 })
	last_name: string;

	@Column({ length: 100, unique: true })
	email: string;

	@Column({ length: 255 })
	password: string;

	@Column({ length: 20 })
	phone_number: string;

	@ManyToOne(() => Roles, (role) => role.users)
	role: Roles;

	@ManyToOne(() => Affiliations, (affiliation) => affiliation.users)
	affiliation: Affiliations;

	@Column({ length: 255, nullable: true })
	otp_secret: string;

	@Column({ type: "varbinary", length: 2048, nullable: true })
	biometric_data: Buffer;

	@Column({ default: false })
	otp_enabled: boolean;

	@Column({ default: 0 })
	failed_attempts: number;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	last_login: Date;

	@Column({ default: false })
	can_perform_surgeries: boolean;

	@OneToMany(() => AuthenticationRequest, (request) => request.trainee)
	authenticationRequestsAsTrainee: AuthenticationRequest[];

	@OneToMany(() => AuthenticationRequest, (request) => request.consultant)
	authenticationRequestsAsConsultant: AuthenticationRequest[];

	@OneToMany(() => UserAvailability, (availability) => availability.user)
	availabilities: UserAvailability[];

	@OneToMany(() => UserPermission, (permission) => permission.user)
	permissions: UserPermission[];

	@OneToMany(() => UserPermission, (permission) => permission.assignedBy)
	permissionsAssigned: UserPermission[];
}
