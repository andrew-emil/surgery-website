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
	COMPLEX = "complex",
	SPECIALIZED = "specialized",
	SUPERVISED = "supervised",
	OBSERVED = "observed",
	SHADOWING = "shadowing",
}

export enum SurgeryRole {
	LEAD_SURGEON = "lead_surgeon",
	ASSISTANT = "assistant",
	OBSERVER = "observer",
	TRAINEE = "trainee",
}

export interface TrainingProgress {
	completed: number;
	required: number;
	remaining: number;
	met: boolean;
	type: SURGERY_TYPE | null;
}

export interface EligibilityResult extends TrainingProgress {
	eligible: boolean;
	reason: string;
}
