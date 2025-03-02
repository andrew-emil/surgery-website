import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from "typeorm";

@Entity()
export class AuditTrail {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	userId: string;

	@Column()
	action: string; // INSERT, UPDATE, DELETE, LOGIN, LOGOUT

	@Column()
	entityName: string;

	@Column({ nullable: true })
	entityId: string; // ID of the affected record

	@Column("json", { nullable: true })
	oldValue: any;

	@Column("json", { nullable: true })
	newValue: any;

	@Column({ type: "varchar", nullable: true })
	ipAddress: string;

	@Column({ type: "varchar", nullable: true })
	userAgent: string;

	@CreateDateColumn()
	timestamp: Date;
}
