import {
	Entity,
	ObjectIdColumn,
	ObjectId,
	Column,
	Index,
	CreateDateColumn,
	ManyToOne,
} from "typeorm";
import { PatientDetails } from "../sub entity/PatientDetails.js";
import { Min, Max } from "class-validator"; 
import { User } from "../sql/User.js";

@Entity()
export class Rating {
	@ObjectIdColumn()
	id: ObjectId;

	@Column({ type: "int" })
	@Index()
	surgeryId: number;

	@Column(() => PatientDetails)
	patient_details: PatientDetails;

	@Column({ type: "int", nullable: true })
	@Min(1)
	@Max(5)
	stars: number;

	@Column({ type: "text", default: "" })
	comments: string;

	@CreateDateColumn({ type: "timestamp" })
	createdAt: Date;
}
