import {
	Entity,
	ObjectIdColumn,
	ObjectId,
	Column,
	Index,
	CreateDateColumn,
} from "typeorm";
import { PatientDetails } from "../sub entity/PatientDetails.js";

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
	rating: number;

	@Column({ type: "text", nullable: true })
	comments: string;

	@CreateDateColumn({ type: "timestamp" })
	createdAt: Date;
}
