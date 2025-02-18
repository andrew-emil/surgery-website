import { Column } from "typeorm";

export class PatientDetails {
	@Column()
	patient_id: string; // Randomized ID for anonymity

	@Column()
	bmi: number;

	@Column({ type: "array" })
	comorbidity: string[];

	@Column()
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
