import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	ManyToMany,
	JoinTable,
} from "typeorm";
import { SurgeryType } from "./SurgeryType.js";

@Entity()
export class SurgeryEquipment {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column({ length: 255, type: "varchar" })
	equipment_name: string;

	@ManyToMany(() => SurgeryType, (surgeryType) => surgeryType.surgeryEquipment)
	@JoinTable({
		name: "surgery_equipment_mapping",
	})
	surgeryType: SurgeryType;
}
