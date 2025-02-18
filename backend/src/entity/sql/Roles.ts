import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "./User.js";
import { UserPermission } from "./UserPermission.js";

enum UserRole {
	STUDENT = "student",
	RESIDENT = "resident",
	CONSULTANT = "consultant",
	ADMIN = "admin",
	NURSE = "nurse",
	SURGEON = "surgeon",
	RESEARCHER = "researcher",
	TECHNICIAN = "technician",
	HOSPITAL_ADMIN = "hospital_admin",
	FELLOW = "fellow",
	ANESTHESIOLOGIST = "anesthesiologist",
	MEDICAL_STUDENT = "medical_student",
}

@Entity()
export class Role {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "enum", enum: UserRole, unique: true })
	name: UserRole;

	@OneToMany(() => User, (user) => user.role)
	users: User[];

	@OneToMany(() => UserPermission, (permission) => permission.role)
	permissions: UserPermission[];
}