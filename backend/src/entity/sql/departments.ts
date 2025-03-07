import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { SurgeryType } from "./SurgeryType.js";
import { User } from "./User.js";
import { Affiliations } from "./Affiliations.js";

@Entity()
export class Department {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255, type: "varchar" })
	name: string;

	@OneToMany(() => User, (user) => user.department)
	users: User[];

	@ManyToOne(() => Affiliations, (affiliation) => affiliation.departments, {
		onDelete: "CASCADE",
	})
	affiliation: Affiliations;

	@ManyToMany(() => SurgeryType, (surgeryType) => surgeryType.departments)
	@JoinTable({
		name: "surgery_type_department"
	})
	surgeryTypes: SurgeryType[];
}
