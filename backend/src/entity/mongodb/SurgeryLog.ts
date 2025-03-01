import {
	Entity,
	ObjectIdColumn,
	ObjectId,
	Column,
	Index,
	VersionColumn,
	UpdateDateColumn,
	CreateDateColumn,
} from "typeorm";
import { PatientDetails } from "../sub entity/PatientDetails.js";
import { STATUS } from "../../utils/dataTypes.js";

@Entity()
export class SurgeryLog {
	@ObjectIdColumn()
	id: ObjectId;

	@Column({ type: "int" })
	@Index()
	surgeryId: number;

	@Column({ type: "simple-array" })
	@Index()
	performedBy: string[];

	@Column({ type: "date" })
	date: Date;

	@Column({ type: "string" })
	time: string;

	@Column({ type: "int", nullable: true })
	surgicalTimeMinutes: number;

	@Column({ type: "int", nullable: true })
	estimatedBloodLossMl: number;

	@Column({ type: "text", nullable: true })
	complications: string;

	@Column({ type: "text", nullable: true })
	bloodProductsUsed: string;

	@Column({ type: "string" })
	cptCode: string;

	@Column({ type: "string" })
	icdCode: string;

	@Column({ type: "enum", default: STATUS.ONGOING })
	status: STATUS; // Completed, Ongoing, Cancelled

	@Column(() => PatientDetails)
	patient_details: PatientDetails;

	@CreateDateColumn({ type: "timestamp" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamp" })
	updatedAt: Date;

	@VersionColumn()
	version: number;
}
