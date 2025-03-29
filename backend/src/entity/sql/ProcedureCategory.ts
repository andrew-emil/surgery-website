import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProcedureType } from "./ProcedureType.js";
import { SURGERY_TYPE } from "../../utils/dataTypes.js";

@Entity()
export class ProcedureCategory {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: "enum",
		enum: SURGERY_TYPE,
	})
	code: SURGERY_TYPE;

	@OneToMany(() => ProcedureType, (procedure) => procedure.category)
	procedures: ProcedureType[];
}
