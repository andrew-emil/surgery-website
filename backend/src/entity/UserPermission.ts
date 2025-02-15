import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Users } from "./User";
import { SurgeryType } from "./SurgeryType";

@Entity()
export class UserPermission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "char", length: 36 })
	user_id: string;

	@Column()
	surgery_type_id: number;

	@Column({ type: "char", length: 36 })
	assigned_by: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	assigned_at: Date;

	@ManyToOne(() => Users, (user) => user.permissions)
	user: Users;

	@ManyToOne(() => SurgeryType, (surgeryType) => surgeryType.permissions)
	surgeryType: SurgeryType;

	@ManyToOne(() => Users, (user) => user.permissionsAssigned)
	assignedBy: Users;
}
