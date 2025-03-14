import { ObjectId } from "typeorm";

export interface JWTPayload {
	id: string;
	userRole: string;
	name: string;
	tokenVersion: number;
	first_login: boolean;
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

export enum USER_STATUS {
	PENDING = "pending",
	ACTIVE = "active",
	INACTIVE = "inactive"
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
	DISCHARGED = "Discharged",
	TRANSFERRED = "Transferred",
	DECEASED = "Deceased",
	REHAB = "Rehabilitation",
}

export enum NOTIFICATION_STATUS {
	READ = "read",
	UNREAD = "unread",
}

export enum NOTIFICATION_TYPES {
	INVITE = "invite",
	AUTH_REQUEST = "auth request",
	SCHEDULE_UPDATE = "schedule update",
	USER_REGISTRATION = "User Registration",
}

export enum Authentication_Request {
	PENDING = "pending",
	CANCELLED = "cancelled",
	APPROVED = "approved",
}

export enum PARTICIPATION_STATUS {
	APPROVED= "Approved",
	PENDING = "Pending",
}