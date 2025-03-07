import { ObjectId } from "typeorm";

export interface JWTPayload {
	id: string;
	userRole: string;
	name: string;
	tokenVersion: number;
	surgeries: Array<{
		id: string;
		date: Date;
		status: STATUS;
		stars: number;
		cptCode: string;
		icdCode: string;
		patient_id: ObjectId;
	}>;
}

export enum STATUS {
	COMPLETED = "Completed",
	ONGOING = "Ongoing",
	CANCELLED = "Cancelled",
}

export enum OUTCOME {
	SUCCESS = "success",
	FAILURE = "failure",
}

export enum AffiliationsType {
	HOSPITAL = "Hospital",
	CLINIC = "Clinic",
	RESEARCH_CENTER = "Research Center",
	UNIVERSITY = "University",
	MEDICAL_SCHOOL = "Medical School",
	PRIVATE_PRACTICE = "Private Practice",
}
