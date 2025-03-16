import { Entity, ObjectIdColumn, ObjectId, Column, Index, CreateDateColumn } from "typeorm";
import { OUTCOME, DISCHARGE_STATUS } from "../../utils/dataTypes.js";

@Entity()
export class PostSurgery {
	@ObjectIdColumn()
	id: ObjectId;

	@Column({ type: "int" })
	@Index()
	surgeryId: number;

	@Column({ type: "int" })
	surgicalTimeMinutes: number;

	@Column({ type: "enum", enum: OUTCOME, nullable: true })
	outcome: OUTCOME;

	@Column({ type: "string", nullable: true })
	complications: string;

	@Column({ type: "enum", enum: DISCHARGE_STATUS, nullable: true })
	dischargeStatus: DISCHARGE_STATUS;

	@Column({ type: "string", nullable: true })
	caseNotes: string;

	@CreateDateColumn({ type: "timestamp" })
	createdAt: Date;
}
