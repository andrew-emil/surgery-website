import { z } from "zod";

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
	confirm_password: z.string(),
});

export const updateAccountSchema = z
	.object({
		first_name: z.string().min(1).optional(),
		last_name: z.string().min(1).optional(),
		email: z.string().email().optional(),
		phone_number: z.string().min(10).max(15).optional(),
		old_password: z.string().min(6).optional(), // Required only if changing password
		new_password: z.string().min(8).optional(),
		confirm_password: z.string().min(8).optional(),
	})
	.refine(
		(data) => {
			if (data.new_password || data.confirm_password) {
				return data.old_password; // Ensure old_password is provided when changing password
			}
			return true;
		},
		{
			message: "Old password is required when updating password.",
			path: ["old_password"],
		}
	);
