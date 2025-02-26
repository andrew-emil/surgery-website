import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	Index,
} from "typeorm";
import { Role } from "./Roles.js";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ length: 50, type: "varchar" })
	first_name: string;

	@Column({ length: 50, type: "varchar" })
	last_name: string;

	@Column({ length: 100, unique: true, type: "varchar" })
	@Index()
	email: string;

	@Column({ length: 255, type: "varchar" })
	password_hash: string;

	@Column({ length: 20, type: "varchar", unique: true })
	@Index()
	phone_number: string;

	@ManyToOne(() => Role, (role) => role.users, {
		onDelete: "CASCADE",
		nullable: true,
		onUpdate: "CASCADE",
	})
	role: Role;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	last_login: Date;

	@Column({ type: "timestamp", nullable: true })
	lock_until: Date;

	@Column({ type: "varchar", nullable: true })
	otp_secret: string;

	@Column({ type: "int", nullable: true })
	failed_attempts: number;

	@Column({ type: "int", default: 0 })
	token_version: number;

	@Column({ type: "varchar", nullable: true })
	reset_token: string;

	@Column({ type: "timestamp", nullable: true })
	reset_token_expires: Date;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
