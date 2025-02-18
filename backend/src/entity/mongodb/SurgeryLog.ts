import { Entity, ObjectIdColumn, ObjectId, Column, Index } from "typeorm";
import { PatientDetails } from "../sub entity/PatientDetails.js";

@Entity()
export class SurgeryLog {
	@ObjectIdColumn()
	id: ObjectId;

	@Column()
	@Index()
	surgery_id: number; // MySQL Foreign Key for reference

	@Column()
	@Index()
	performed_by: number; // Consultant ID from MySQL

	@Column()
	date: Date;

	@Column()
	time: string;

	@Column()
	cpt_code: string;

	@Column()
	status: string; // Completed, Ongoing, Cancelled

	@Column(() => PatientDetails)
	patient_details: PatientDetails;

	@Column()
	procedure_details_id: ObjectId;

	@Column()
	post_surgery_id: ObjectId;
}
