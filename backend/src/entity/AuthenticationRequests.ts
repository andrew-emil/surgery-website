import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./User";

enum STATUS {
	PENDING = "pending",
	APPROVED = "approved",
	REJECTED = "rejected",
}

@Entity()
export class AuthenticationRequest {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "char", length: 36 })
	trainee_id: string;

	@Column({ type: "char", length: 36 })
	consultant_id: string;

	@Column({ length: 255 })
	surgery_log_id: string;

	@Column({
		type: "enum",
		enum: STATUS,
		default: STATUS.PENDING,
	})
	status: STATUS;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@ManyToOne(() => Users, (user) => user.authenticationRequestsAsTrainee)
	trainee: Users;

	@ManyToOne(() => Users, (user) => user.authenticationRequestsAsConsultant)
	consultant: Users;
}
