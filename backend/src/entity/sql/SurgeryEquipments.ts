import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { SurgeryType } from "./SurgeryType.js";

@Entity()
export class SurgeryEquipment {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ length: 255, type: "varchar" })
	equipment_name: string;

	@ManyToOne(() => SurgeryType, (surgeryType) => surgeryType.equipment)
	surgeryType: SurgeryType;
}
