import { z } from "zod";
import { formatErrorMessage } from "./formatErrorMessage.js";

export function validateSchema(schema: z.ZodObject<any>, data: any) {
	const validation = schema.safeParse(data);
	if (!validation.success)
		throw Error(formatErrorMessage(validation), {
			cause: validation.error,
		});

	return validation.data;
}
