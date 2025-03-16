import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToMany,
	JoinTable,
} from "typeorm";
import { Department } from "./departments.js";

@Entity()
export class SurgeryEquipment {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column({ length: 255, type: "varchar" })
	equipment_name: string;

	@Column({ type: "blob", nullable: true })
	photo: Buffer;

	@ManyToMany(() => Department, (department) => department.surgeryEquipment)
	@JoinTable({
		name: "surgery_equipment_mapping",
	})
	department: Department;
}
