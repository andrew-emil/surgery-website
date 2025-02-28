import { Entity, ObjectIdColumn, ObjectId, Column, Index } from "typeorm";
import { OUTCOME } from "../../utils/dataTypes.js";

@Entity()
export class PostSurgery {
	@ObjectIdColumn()
	id: ObjectId;

	@Column({ type: "int" })
	@Index()
	surgeryId: number;

	@Column({ type: "enum", nullable: true })
	outcome: OUTCOME;

	@Column({ type: "string", nullable: true })
	complications: string;

	@Column({ type: "string", nullable: true })
	dischargeStatus: string;

	@Column({ type: "string", nullable: true })
	caseNotes: string;
}
