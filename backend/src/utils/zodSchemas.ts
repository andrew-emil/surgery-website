import { z } from "zod";
import { AffiliationsType } from "./dataTypes.js";

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
	surgeryTypes: z.array(z.string()).nonempty().optional(),
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
	hospitalId: z.string(),
	surgeryTypeId: z.string(),
	performedBy: z.array(z.string().min(1)).nonempty(),
	date: z.string().refine((d) => !isNaN(Date.parse(d)), {
		message: "Invalid date format",
	}),
	time: z.string(),
	surgicalTimeMinutes: z.number().optional(),
	cptCode: z.string(),
	icdCode: z.string(),
	patientBmi: z.number().optional(),
	patientComorbidity: z.array(z.string().min(1)).nonempty().optional(),
	patientDiagnosis: z.string().optional(),
});
