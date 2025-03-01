import { Column, ObjectId } from "typeorm";

export class PatientDetails {
	@Column({ type: "string" })
	patient_id: ObjectId;

	@Column({ type: "int" })
	bmi: number;

	@Column({ type: "json" })
	comorbidity: string[];

	@Column({ type: "string" })
	diagnosis: string;

	constructor(
		patientId: string,
		bmi: number,
		comorbidity: string[],
		diagnosis: string
	) {
		this.patient_id = new ObjectId(patientId);
		this.bmi = bmi;
		this.comorbidity = comorbidity;
		this.diagnosis = diagnosis;
	}
}
