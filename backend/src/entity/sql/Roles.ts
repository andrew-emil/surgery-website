import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
	ManyToMany,
	JoinTable,
} from "typeorm";
import { User } from "./User.js";
import { Permission } from "./Permission.js";
import { SURGERY_TYPE } from "../../utils/dataTypes.js";

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", unique: true })
	name: string;

	@Column({ type: "enum", enum: SURGERY_TYPE, nullable: true })
	requiredSurgeryType: SURGERY_TYPE;

	@Column({ type: "int", default: 0 })
	requiredCount: number;

	@OneToMany(() => User, (user) => user.role)
	users: User[];

	@ManyToOne(() => Role, (role) => role.children, { nullable: true })
	parent: Role;

	@OneToMany(() => Role, (role) => role.parent)
	children: Role[];

	@ManyToMany(() => Permission, (perm) => perm.role)
	@JoinTable({
		name: "role_permission",
	})
	permissions: Permission[];

	static readonly INTERN = "Internship Doctor";
	static readonly RESIDENT = "Resident Doctor";
	static readonly SPECIALIST = "Specialist";
	static readonly CONSULTANT = "Consultant";
	static readonly DEPARTMENT_HEAD = "Department Head";
}
