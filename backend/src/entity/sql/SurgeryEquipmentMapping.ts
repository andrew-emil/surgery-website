import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SurgeryType } from "./SurgeryType.js";
import { SurgeryEquipment } from "./SurgeryEquipments.js";

@Entity()
export class SurgeryEquipmentMapping {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => SurgeryType, {
		onDelete: "CASCADE",
		eager: true,
		nullable: false,
	})
	surgery_type: SurgeryType;

	@ManyToOne(() => SurgeryEquipment, {
		onDelete: "CASCADE",
		eager: true,
		nullable: false,
	})
	equipment: SurgeryEquipment;
}
