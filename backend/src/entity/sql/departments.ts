import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SurgeryType } from "./SurgeryType.js";

@Entity()
export class Department {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255, type: "varchar" })
	name: string;

	@OneToMany(() => SurgeryType, (surgeryType) => surgeryType.department)
	surgeryTypes: SurgeryType[];
}
