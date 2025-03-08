import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Affiliations } from "./Affiliations.js";
import { SurgeryType } from "./SurgeryType.js";

@Entity()
export class Surgery {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@ManyToOne(() => Affiliations, {
		onDelete: "SET NULL",
		nullable: true,
		onUpdate: "CASCADE",
	})
	hospital: Affiliations;

	@ManyToOne(() => SurgeryType, {
		onDelete: "SET NULL",
		nullable: true,
		onUpdate: "CASCADE",
	})
	surgery_type: SurgeryType;
}
