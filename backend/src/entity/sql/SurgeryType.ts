import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Department } from "./departments.js";
import { SurgeryEquipment } from "./SurgeryEquipments.js";

@Entity()
export class SurgeryType {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255, type: "varchar" })
	name: string;

	@ManyToMany(() => Department, (department) => department.surgeryTypes)
	departments: Department[];

	@ManyToMany(() => SurgeryEquipment, (equipment) => equipment.surgeryType)
	surgeryEquipment: SurgeryEquipment[];
}
