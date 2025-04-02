export interface JWTPayload {
	id: string;
	userRole: string;
	permissions: string[];
	name: string;
	picture: Buffer;
	tokenVersion: number;
	first_login: boolean;
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

export enum USER_STATUS {
	PENDING = "pending",
	ACTIVE = "active",
	INACTIVE = "inactive",
}

export enum AffiliationsType {
	HOSPITAL = "Hospital",
	CLINIC = "Clinic",
	RESEARCH_CENTER = "Research Center",
	UNIVERSITY = "University",
	MEDICAL_SCHOOL = "Medical School",
	PRIVATE_PRACTICE = "Private Practice",
}

export enum UserLevel {
	STUDENT = "Student",
	INTERN = "Intern",
	RESIDENT = "Resident",
	SERVICE = "Service",
	ATTACHMENT = "Attachment",
}

export enum DISCHARGE_STATUS {
	OBSERVATION = "under_observation",
	DISCHARGED = "discharged",
	TRANSFERRED = "transferred",
	DECEASED = "deceased",
}

export enum NOTIFICATION_STATUS {
	READ = "read",
	UNREAD = "unread",
}

export enum NOTIFICATION_TYPES {
	INVITE = "invite",
	AUTH_REQUEST = "auth_request",
	SCHEDULE_UPDATE = "schedule_update",
	USER_REGISTRATION = "User Registration",
}

export enum Authentication_Request {
	PENDING = "pending",
	CANCELLED = "cancelled",
	APPROVED = "approved",
}

export enum PARTICIPATION_STATUS {
	APPROVED = "Approved",
	PENDING = "Pending",
}

export enum SURGERY_TYPE {
	PS = "supervised",
	AS = "assistance",
	PI = "independent",
	O = "observation",
}

export interface TrainingProgress {
	overallStatus:
		| "FULLY_QUALIFIED"
		| "PARTIALLY_QUALIFIED"
		| "NOT_QUALIFIED"
		| "NOT_REQUIRED";
	requirements: Array<{
		procedureId: number;
		procedureName: string;
		category: string;
		required: number;
		completed: number;
		remaining: number;
		met: boolean;
	}>;
	totalCompleted: number;
	totalRequired: number;
	completionPercentage: number;
}

export interface EligibilityResult extends TrainingProgress {
	eligible: boolean;
	reason: string;
}

export type RequirementProgress = {
	procedureId: number;
	procedureName: string;
	category: string;
	required: number;
	completed: number;
	remaining: number;
	met: boolean;
};