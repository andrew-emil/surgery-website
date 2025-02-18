import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Department } from "./departments.js";

@Entity()
export class SurgeryType {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255, type: "varchar" })
	name: string;

	@ManyToOne(() => Department, (department) => department.surgeryTypes)
	department: Department;
}
