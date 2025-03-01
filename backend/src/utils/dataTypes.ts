import { ObjectId } from "typeorm";

export interface JWTPayload {
	userId: string;
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
