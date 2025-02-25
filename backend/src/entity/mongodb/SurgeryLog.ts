import { Entity, ObjectIdColumn, ObjectId, Column, Index } from "typeorm";
import { PatientDetails } from "../sub entity/PatientDetails.js";

@Entity()
export class SurgeryLog {
	@ObjectIdColumn()
	id: ObjectId;

	@Column({ type: "int" })
	@Index()
	surgery_id: number; // MySQL Foreign Key for reference

	@Column({ type: "int" })
	stars: number;

	@Column({ type: "array" })
	@Index()
	performed_by: string[];

	@Column({ type: "date" })
	date: Date;

	@Column({ type: "string" })
	time: string;

	@Column({ type: "string" })
	cpt_code: string;

	@Column({ type: "string" })
	status: string; // Completed, Ongoing, Cancelled

	@Column(() => PatientDetails)
	patient_details: PatientDetails;

	@Column()
	procedure_details_id: ObjectId;

	@Column()
	post_surgery_id: ObjectId;
}
