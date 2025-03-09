import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.js";
import { Authentication_Request } from "../../utils/dataTypes.js";


@Entity()
export class AuthenticationRequest {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255, type: "varchar" })
	surgery_id: string;

	@Column({
		type: "enum",
		enum: Authentication_Request,
		default: Authentication_Request.PENDING,
	})
	status: Authentication_Request;

	@CreateDateColumn()
	created_at: Date;

	@ManyToOne(() => User)
	trainee: User;

	@ManyToOne(() => User)
	consultant: User;
}
