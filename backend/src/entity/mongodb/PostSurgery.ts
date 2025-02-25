import { Entity, ObjectIdColumn, ObjectId, Column, Index } from "typeorm";

@Entity()
export class PostSurgery {
	@ObjectIdColumn()
	id: ObjectId;

	@Column({ type: "string" })
	@Index()
	surgery_id: ObjectId;

	@Column({ type: "string" })
	outcome: string;

	@Column({ type: "string" })
	complications: string;

	@Column({ type: "string" })
	discharge_status: string;

	@Column({ type: "string" })
	case_notes: string;

	@Column({ type: "int" })
	rating: number;

	@Column({ type: "string" })
	feedback: string;
}
