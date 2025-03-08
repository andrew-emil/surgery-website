import { Column } from "typeorm";
import { DoctorRole } from "../../utils/dataTypes.js";

export class DoctorsRoles {
	@Column({ type: "uuid" })
	doctorId: string;

	@Column({ type: "enum", enum: DoctorRole })
	role: DoctorRole;

	constructor(doctorId: string, role: DoctorRole) {
		this.doctorId = doctorId;
		this.role = role;
	}
}
