import { Column } from "typeorm";

export class PatientDetails {
	@Column({ type: "string" })
	patient_id: string;

	@Column({ type: "int" })
	bmi: number;

	@Column({ type: "simple-array" })
	comorbidity: string[];

	@Column({ type: "string" })
	diagnosis: string;

	constructor(
		patientId: string,
		bmi: number,
		comorbidity: string[],
		diagnosis: string
	) {
		this.patient_id = patientId;
		this.bmi = bmi;
		this.comorbidity = comorbidity;
		this.diagnosis = diagnosis;
	}
}