export interface JWTPayload {
	userId: string;
	userRole: string;
	name: string;
	tokenVersion: number;
	surgeries: Array<{
		id: string;
		date: Date;
		status: string;
		stars: number;
		patient_id: string;
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
