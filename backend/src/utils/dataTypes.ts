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
