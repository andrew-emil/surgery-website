import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { AffiliationsType } from "../../utils/dataTypes.js";

@Entity()
export class Affiliations {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column({ length: 100, type: "varchar" })
	name: string;

	@Column({ length: 200, type: "varchar" })
	city: string;

	@Column({ type: "text" })
	country: string;

	@Column({ length: 255, type: "varchar" })
	address: string;

	@Column({
		type: "enum",
		enum: AffiliationsType,
		default: AffiliationsType.HOSPITAL,
	})
	institution_type: AffiliationsType;
}
