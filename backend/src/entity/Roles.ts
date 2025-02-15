import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
} from "typeorm";
import { Users } from "./User";

@Entity()
export class Roles {
	@PrimaryGeneratedColumn("uuid")
	role_id: string;

	@Column("varchar", { length: 100 })
	role_name: string;

	@OneToMany(() => Users, (user) => user.role)
	users: Users[];
}
