import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
} from "typeorm";
import { Department } from "./departments";
import { SurgeryEquipment } from "./SurgeryEquipments";
import { UserPermission } from "./UserPermission";

@Entity()
export class SurgeryType {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255 })
	name: string;

	@ManyToOne(() => Department, (department) => department.surgeryTypes)
	department: Department;

	@OneToMany(() => SurgeryEquipment, (equipment) => equipment.surgeryType)
	equipment: SurgeryEquipment[];

	@OneToMany(() => UserPermission, (permission) => permission.surgeryType)
	permissions: UserPermission[];
}
