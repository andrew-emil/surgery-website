import { Entity, ObjectIdColumn, ObjectId, Column, Index } from "typeorm";

@Entity()
export class ProcedureDetails {
	@ObjectIdColumn()
	id: ObjectId;

	@Column({ type: "objectid" })
	@Index()
	surgery_id: ObjectId;

	@Column({ type: "int" })
	surgical_time: number;

	@Column({ type: "int" })
	estimated_blood_loss: number;

	@Column({ type: "simple-array" })
	complications: string[];

	@Column({ type: "string" })
	blood_products_used: string;
}
