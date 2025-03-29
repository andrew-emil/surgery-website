import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { ProcedureCategory } from "./ProcedureCategory.js";
import { Requirement } from "./Requirments.js";
import { Surgery } from "./Surgery.js";
import { UserProgress } from "./UserProgress.js";

@Entity()
export class ProcedureType {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" })
	name: string; // مثال: "Lumbar puncture"

	@ManyToOne(() => ProcedureCategory, (category) => category.procedures)
	category: ProcedureCategory;

	@OneToMany(() => Requirement, (requirement) => requirement.procedure)
	requirements: Requirement[];

	@OneToMany(() => Surgery, (surergy) => surergy.procedure)
	surgeries: Surgery;

	@OneToMany(() => UserProgress, (progress) => progress.procedure)
	progress: UserProgress;
}
