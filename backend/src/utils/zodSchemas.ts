import { z } from "zod";
import {
	AffiliationsType,
	DISCHARGE_STATUS,
	OUTCOME,
	NOTIFICATION_TYPES,
	PARTICIPATION_STATUS,
} from "./dataTypes.js";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const registerSchema = z.object({
	first_name: z.string(),
	last_name: z.string(),
	email: z.string().email(),
	phone_number: z
		.string({ message: "phone field must be provided" })
		.min(8, "Please enter a valid phone number")
		.refine((val) => val[0] === "+", {
			message: "Please enter a valid phone number",
		}),
	password: z.string(),
	roleId: z.number(),
	affiliationId: z.number(),
	departmentId: z.number(),
});

export const updateAccountSchema = z.object({
	first_name: z.string().min(1).optional(),
	last_name: z.string().min(1).optional(),
	email: z.string().email().optional(),
	phone_number: z.string().min(10).max(15).optional(),
	old_password: z.string().min(6).optional(),
	new_password: z.string().min(8).optional(),
});

export const updateDepartmentSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	affiliationId: z.string().optional(),
	surgeryEquipments: z.array(z.string()).nonempty().optional(),
});

export const addAffiliationSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	city: z.string().min(2, "City must be at least 2 characters"),
	country: z.string().min(2, "Country must be at least 2 characters"),
	address: z.string().min(2, "Address must be at least 2 characters"),
	institution_type: z
		.string()
		.refine(
			(val) =>
				Object.values(AffiliationsType).includes(val as AffiliationsType),
			{
				message: "Invalid institution type",
			}
		),
});

export const updateAffiliationSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	city: z.string().optional(),
	country: z.string().optional(),
	address: z.string().optional(),
	institution_type: z
		.string()
		.refine(
			(val) =>
				Object.values(AffiliationsType).includes(val as AffiliationsType),
			{
				message: "Invalid institution type",
			}
		)
		.optional(),
});

export const addSurgerySchema = z.object({
	hospitalId: z.number(),
	departmentId: z.number(),
	name:z.string(),
	leadSurgeon: z.string(),
	doctorsTeam: z
		.array(
			z.object({
				doctorId: z.string(),
				roleId: z.number(),
				permissions: z.array(z.number()),
				participationStatus: z.nativeEnum(PARTICIPATION_STATUS),
				notes: z.string().optional(),
			})
		)
		.nonempty()
		.optional(),
	date: z.string().refine((d) => !isNaN(Date.parse(d)), {
		message: "Invalid date format",
	}),
	time: z.string(),
	cptCode: z.string(),
	icdCode: z.string(),
	patientBmi: z.number().optional(),
	patientComorbidity: z.array(z.string().min(1)).optional(),
	patientDiagnosis: z.string().optional(),
});

export const addPostSurgerySchema = z.object({
	surgeryId: z.number(),
	surgicalTimeMinutes: z.string().refine((num) => !isNaN(parseInt(num))),
	outcome: z.nativeEnum(OUTCOME).optional(),
	complications: z
		.string()
		.max(1000, "Complications must be less than 1000 characters")
		.optional(),
	dischargeStatus: z.nativeEnum(DISCHARGE_STATUS).optional(),
	caseNotes: z
		.string()
		.max(2000, "Case notes must be less than 2000 characters")
		.optional(),
});

export const createNotificationSchema = z.object({
	userId: z.string(),
	type: z.nativeEnum(NOTIFICATION_TYPES),
	message: z.string(),
});

export const createRequestSchema = z.object({
	surgeryId: z.string().refine((id) => !isNaN(parseInt(id))),
	traineeId: z.string(),
	consultantId: z.string(),
	roleId: z.string().refine((id) => !isNaN(parseInt(id))),
	permissions: z.array(z.string().refine((perm) => !isNaN(parseInt(perm)))),
	notes: z.string().optional(),
});

export const editRequestSchema = z.object({
	surgeryId: z.string().refine((id) => !isNaN(parseInt(id))),
	traineeId: z.string(),
	roleId: z
		.string()
		.refine((id) => !isNaN(parseInt(id)))
		.optional(),
	permissions: z
		.array(z.string().refine((perm) => !isNaN(parseInt(perm))))
		.optional(),
	notes: z.string().optional(),
});
