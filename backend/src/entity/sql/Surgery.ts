import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Affiliations } from "./Affiliations.js";
import { SurgeryType } from "./SurgeryType.js";

@Entity()
export class Surgery {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@ManyToOne(() => Affiliations, { onDelete: "CASCADE" })
	hospital: Affiliations;

	@ManyToOne(() => SurgeryType)
	surgery_type: SurgeryType;
}
