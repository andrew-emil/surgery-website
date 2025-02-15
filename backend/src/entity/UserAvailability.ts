import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Users } from "./User";

@Entity()
export class UserAvailability {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "char", length: 36 })
	user_id: string;

	@Column({ type: "date" })
	available_date: Date;

	@Column({ type: "time" })
	available_time_start: string;

	@Column({ type: "time" })
	available_time_end: string;

	@Column({
		type: "enum",
		enum: ["available", "booked"],
		default: "available",
	})
	status: string;

	@ManyToOne(() => Users, (user) => user.availabilities)
	user: Users;
}
