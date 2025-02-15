import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Users } from "./User";

enum AffiliationsType {
	hospital = "Hospital",
	clinic= "Clinic",
	research_center= "Research Center",
}

@Entity()
export class Affiliations {
	@PrimaryGeneratedColumn("uuid")
	affiliations_id: string;

	@Column({ length: 100 })
	name: string;

	@Column({ length: 200 })
	city: string;

	@Column({ type: "text" })
	country: string;

	@Column({ length: 255 })
	address: string;

	@Column("enum", {
		enum: AffiliationsType,
		default: AffiliationsType.hospital,
	})
	institution_type: AffiliationsType;

	@OneToMany(() => Users, (user) => user.affiliation)
	users: Users[];
}
