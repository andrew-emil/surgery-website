import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Affiliations } from "./Affiliations.js";
import { AuthenticationRequest } from "./AuthenticationRequests.js";
import { Role } from "./Roles.js";
import { Department } from "./departments.js";

@Entity()
export class Surgery {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@OneToOne(() => Role)
	@JoinColumn()
	minRole: Role;

	@ManyToOne(() => Affiliations, {
		onDelete: "SET NULL",
		nullable: true,
		onUpdate: "CASCADE",
	})
	hospital: Affiliations;

	@ManyToOne(() => Department, {
		onDelete: "SET NULL",
		nullable: true,
		onUpdate: "CASCADE",
	})
	depaertment: Department;

	@OneToMany(() => AuthenticationRequest, (req) => req.surgery)
	authentication: AuthenticationRequest;
}
