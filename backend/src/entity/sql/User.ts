import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Role } from "./Roles.js";
import { Affiliations } from "./Affiliations.js";
import { Department } from "./departments.js";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ length: 50, type: "varchar" })
	first_name: string;

	@Column({ length: 50, type: "varchar" })
	last_name: string;

	@Column({ length: 100, unique: true, type: "varchar" })
	email: string;

	@Column({ length: 255, type: "varchar" })
	password_hash: string;

	@Column({ length: 20, type: "varchar" })
	phone_number: string;

	@ManyToOne(() => Role, (role) => role.users)
	role: Role;

	@ManyToOne(() => Affiliations, { nullable: true, onDelete: "SET NULL" })
	@JoinColumn({ name: "affiliation_id" })
	affiliation: Affiliations;

	@ManyToOne(() => Department, { nullable: true, onDelete: "SET NULL" })
	@JoinColumn({ name: "department_id" })
	department: Department;

	@Column({ length: 255, nullable: true, type: "varchar" })
	otp_secret: string;

	@Column({ type: "boolean", default: false })
	otp_enabled: boolean;

	@Column({ type: "int", default: 0 })
	failed_attempts: number;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	last_login: Date;
}
