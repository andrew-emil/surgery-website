import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
	ManyToOne,
} from "typeorm";
import { User } from "./User.js";
import { Permission } from "./Permission.js";

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", unique: true })
	name: string;

	@OneToMany(() => User, (user) => user.role)
	users: User[];

	@ManyToMany(() => Permission, { cascade: true })
	@JoinTable({
		name: "role_permission",
	})
	permissions: Permission[];

	@ManyToOne(() => Role, (role) => role.children, { nullable: true })
	parent: Role;

	@OneToMany(() => Role, (role) => role.parent)
	children: Role[];
}
