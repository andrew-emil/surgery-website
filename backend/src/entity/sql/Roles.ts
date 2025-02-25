import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
} from "typeorm";
import { User } from "./User.js";
import { UserPermission } from "./UserPermission.js";

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", unique: true })
	name: string;

	@OneToMany(() => User, (user) => user.role)
	users: User[];

	@ManyToMany(() => UserPermission)
	@JoinTable()
	permissions: UserPermission[];
}
