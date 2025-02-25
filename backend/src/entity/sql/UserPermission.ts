import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.js";
import { Role } from "./Roles.js";

enum PermissionAction {
	CREATE_SURGERY = "create_surgery",
	EDIT_SURGERY = "edit_surgery",
	INVITE_PARTICIPANTS = "invite_participants",
	APPROVE_PARTICIPATION = "approve_participation",
	ASSIGN_ROLES = "assign_roles",
	MANAGE_HOSPITAL_SETTINGS = "manage_hospital_settings",
	GENERATE_REPORTS = "generate_reports",
	PERFORM_SURGERY = "perform_surgery",
	UPDATE_SURGERY_TEAM = "update_surgery_team",
	ACCESS_PATIENT_RECORDS = "access_patient_records",
	MANAGE_EQUIPMENT = "manage_equipment",
	APPROVE_SURGERY = "approve_surgery",
}

@Entity()
export class UserPermission {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column({ type: "enum", enum: PermissionAction })
	action: PermissionAction;

	@ManyToOne(() => Role, { onDelete: "CASCADE" })
	role: Role;

	@ManyToOne(() => User)
	assigned_by: User;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	assigned_at: Date;

	@Column({ type: "timestamp", nullable: true })
	expires_at: Date;
}
