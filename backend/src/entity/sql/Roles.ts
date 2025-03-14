import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
	ManyToMany,
	JoinTable,
	OneToOne,
} from "typeorm";
import { User } from "./User.js";
import { Permission } from "./Permission.js";
import { Surgery } from "./Surgery.js";

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", unique: true })
	name: string;

	@OneToMany(() => User, (user) => user.role)
	users: User[];

	@ManyToOne(() => Role, (role) => role.children, { nullable: true })
	parent: Role;

	@OneToMany(() => Role, (role) => role.parent)
	children: Role[];

	@ManyToMany(() => Permission, (perm) => perm.role)
	@JoinTable({
		name: "role_permission"
	})
	permissions: Permission[];
}
