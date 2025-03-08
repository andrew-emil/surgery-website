import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from "typeorm";
import { Department } from "./departments.js";
import { SurgeryEquipment } from "./SurgeryEquipments.js";
import { SurgeryRequirement } from "./SurgeryRequirements.js";

@Entity()
export class SurgeryType {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255, type: "varchar" })
	name: string;

	@Column({ type: "int" })
	requiredLevel: number;

	@ManyToMany(() => Department, (department) => department.surgeryTypes)
	departments: Department[];

	@ManyToMany(() => SurgeryEquipment, (equipment) => equipment.surgeryType)
	surgeryEquipment: SurgeryEquipment[];

	@OneToMany(() => SurgeryRequirement, (requirement) => requirement.surgery)
	requirements: SurgeryRequirement;
}
