import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
} from "typeorm";
import { User } from "./User.js";

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
}
