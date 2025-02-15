import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { SurgeryType } from "./SurgeryType";

@Entity()
export class SurgeryEquipment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255 })
	equipment_name: string;

	@ManyToOne(() => SurgeryType, (surgeryType) => surgeryType.equipment)
	surgeryType: SurgeryType;
}
