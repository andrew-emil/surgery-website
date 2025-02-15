import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SurgeryType } from "./SurgeryType";

@Entity()
export class Department {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255 })
	name: string;

	@OneToMany(() => SurgeryType, (surgeryType) => surgeryType.department)
	surgeryTypes: SurgeryType[];
}
