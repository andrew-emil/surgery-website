import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
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
	@JoinTable()
	permissions: Permission[];
}
