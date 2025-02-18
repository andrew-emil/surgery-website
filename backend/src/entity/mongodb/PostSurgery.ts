import { Entity, ObjectIdColumn, ObjectId, Column, Index } from "typeorm";

@Entity()
export class PostSurgery {
	@ObjectIdColumn()
	id: ObjectId;

	@Column()
	@Index()
	surgery_id: ObjectId;

	@Column()
	outcome: string;

	@Column()
	complications: string;

	@Column()
	discharge_status: string;

	@Column()
	case_notes: string;

	@Column()
	rating: number;

	@Column()
	feedback: string;
}
