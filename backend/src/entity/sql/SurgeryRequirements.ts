import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserLevel } from "../../utils/dataTypes.js";
import { SurgeryType } from "./SurgeryType.js";

@Entity()
export class SurgeryRequirement {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: "int" })
    level: number;

    @ManyToOne(() => SurgeryType, (surgery) => surgery.requirements)
    surgery: SurgeryType;

    @Column({ type: "int" })
    requiredCount: number;

    @Column({ type: "enum", enum:UserLevel })
    minRole: string;
}