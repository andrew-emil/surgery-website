import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.js";
import { Affiliations } from "./Affiliations.js";

@Entity()
export class UserAffiliations {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
	user: User;

	@ManyToOne(() => Affiliations)
	affiliation: Affiliations;
}
