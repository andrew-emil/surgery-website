import { register } from "../services/apiUser";
import { convertImage } from "../utils/convertImage";

export async function registerAction({ request }) {
	const formData = await request.formData();

	const password = formData.get("password");
	const confirmPassword = formData.get("confirm_password");

	if (password !== confirmPassword) {
		return { error: "Passwords don't match" };
	}

	const picture = formData.get("picture");
	if (picture && picture.size > 0) {
		const arrayBuffer = await picture.arrayBuffer();
		const base64Image = convertImage(new Uint8Array(arrayBuffer));

		formData.set("picture", base64Image);
	}

	try {
		const result = await register(formData);
		if (result.error) {
			return { error: result.error };
		}
		return { message: result.message, email: formData.get("email") };
	} catch (err) {
		const response = err.response;
		if (response && response.data && response.data.message) {
			return { error: response.data.message };
		}
		return { error: "Registration failed" };
	}
}
