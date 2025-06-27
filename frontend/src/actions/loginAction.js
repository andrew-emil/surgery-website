import { login } from "../services/apiUser";

export async function loginAction({ request }) {
	const formData = await request.formData();

	const result = await login(formData);

	if (result.error) {
		return { error: result.error };
	}

	return { email: formData.get("email"), success: true };
}
