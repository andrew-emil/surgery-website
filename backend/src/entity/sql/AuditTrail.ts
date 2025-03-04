import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from "typeorm";

@Entity()
export class AuditTrail {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column({ type: "uuid" })
	userId: string;

	@Column({ type: "varchar" })
	action: string; // INSERT, UPDATE, DELETE, LOGIN, LOGOUT

	@Column({ type: "varchar" })
	entityName: string;

	@Column({ nullable: true, type: "varchar" })
	entityId: string; // ID of the affected record

	@Column({ nullable: true, type: "json" })
	oldValue: any;

	@Column({ nullable: true, type: "json" })
	newValue: any;

	@Column({ type: "varchar", nullable: true })
	ipAddress: string;

	@Column({ type: "varchar", nullable: true })
	userAgent: string;

	@CreateDateColumn({ type: "datetime", precision: 6 })
	timestamp: Date;
}
