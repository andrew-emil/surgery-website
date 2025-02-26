import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserAffiliations } from "./UserAffiliations.js";

enum AffiliationsType {
	HOSPITAL = "Hospital",
	CLINIC = "Clinic",
	RESEARCH_CENTER = "Research Center",
	UNIVERSITY = "University",
	MEDICAL_SCHOOL = "Medical School",
	PRIVATE_PRACTICE = "Private Practice",
}

@Entity()
export class Affiliations {
	@PrimaryGeneratedColumn('increment')
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

	@OneToMany(
		() => UserAffiliations,
		(userAffiliation) => userAffiliation.affiliation
	)
	userAffiliations: UserAffiliations[];
}
