import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
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
	surgery_id: string;

	@Column({ type: "enum", enum: STATUS, default: STATUS.PENDING })
	status: STATUS;

	@CreateDateColumn()
	created_at: Date;

	@ManyToOne(() => User)
	trainee: User;

	@ManyToOne(() => User)
	consultant: User;
}
