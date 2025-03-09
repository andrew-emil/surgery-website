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

export enum DoctorRole {
	O = "Observer",
	AS = "Assistant Surgeon",
	PS = "Primary Surgeon",
	PI = "Procedure Instructor",
}

export enum DISCHARGE_STATUS {
	HOME = "Home",
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
	AUTH_REQUEST = "auth_request",
	SCHEDULE_UPDATE = "schedule_update",
}

export enum Authentication_Request {
	PENDING = "pending",
	CANCELLED = "cancelled",
	APPROVED = "approved",
}