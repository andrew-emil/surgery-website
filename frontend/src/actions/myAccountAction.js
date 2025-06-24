import axiosClient from "../axiosClient";
import * as jose from "jose";

export async function myAccountAction({ request }) {
	const formData = await request.formData();
	const intent = formData.get("intent");

	try {
		if (intent === "delete") {
			await axiosClient.delete("/users", { withCredentials: true });

			return { message: "Account deleted successfully." };
		}

		const password = formData.get("new_password");
		const confirmPassword = formData.get("confirm_password");
		if (password && password !== confirmPassword) {
			return { error: { confirm_password: "Passwords do not match" } };
		}

		const phone = formData.get("phone_number");
		if (phone && !/^\+[0-9]+$/.test(phone)) {
			return { error: { phone_number: "Invalid phone number format" } };
		}

		const updateData = new FormData();
		updateData.append("first_name", formData.get("first_name"));
		updateData.append("last_name", formData.get("last_name"));
		updateData.append("email", formData.get("email"));
		updateData.append("phone_number", phone);

		const picture = formData.get("picture");
		if (picture && picture.size > 0) {
			const base64Image = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
				reader.readAsDataURL(picture);
			});
			updateData.append("picture", base64Image);
		}

		if (password) {
			updateData.append("old_password", formData.get("old_password"));
			updateData.append("new_password", password);
		}

		//TODO: put the secret ket in .env file
		const secret = new TextEncoder().encode("mySecret1243");
		const { data } = await axiosClient.patch("/users", updateData, {
			withCredentials: true,
		});

		const token = data.token;
		const { payload } = await jose.jwtVerify(token, secret, {
			algorithms: ["HS256"],
		});

		return { message: data.message, token, payload };
	} catch (err) {
		const response = err.response;
		if (response) {
			if (response.data && typeof response.data === "object") {
				if (response.data.errors) {
					return { error: response.data.errors };
				}

				if (response.data.field && response.data.message) {
					return { error: { [response.data.field]: response.data.message } };
				}
			}
			return {
				error:
					typeof response.data.message === "string"
						? response.data.message
						: "An error occurred.",
			};
		}
		return { error: "An unexpected error occurred." };
	}
}
