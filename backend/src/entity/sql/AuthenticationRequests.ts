import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.js";

enum STATUS {
	PENDING = "pending",
	APPROVED = "approved",
	REJECTED = "rejected",
}

@Entity()
export class AuthenticationRequest {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255, type: "varchar" })
	surgery_log_id: string;

	@Column({
		type: "enum",
		enum: STATUS,
		default: STATUS.PENDING,
	})
	status: STATUS;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@ManyToOne(() => User, (user) => user.authenticationRequestsAsTrainee)
	trainee: User;

	@ManyToOne(() => User, (user) => user.authenticationRequestsAsConsultant)
	consultant: User;
}
