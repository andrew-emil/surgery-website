import { Entity, ObjectIdColumn, ObjectId, Column, Index } from "typeorm";

@Entity()
export class ProcedureDetails {
	@ObjectIdColumn()
	id: ObjectId;

	@Column()
	@Index()
	surgery_id: ObjectId; // Reference to SurgeryLog

	@Column()
	surgical_time: number;

	@Column()
	estimated_blood_loss: number;

	@Column({ type: "array" })
	complications: string[];

	@Column()
	blood_products_used: string;
}
