import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { SurgeryType } from "./SurgeryType.js";
import { User } from "./User.js";

@Entity()
export class Department {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255, type: "varchar" })
	name: string;

	@OneToMany(() => User, (user) => user.department)
	users: User[];

	@ManyToMany(() => SurgeryType, (surgeryType) => surgeryType.departments)
	@JoinTable()
	surgeryTypes: SurgeryType[];
}
