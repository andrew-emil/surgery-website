import axiosClient from "./../axiosClient";

export async function fetchUserData() {
	try {
		const [userRes, progressRes] = await Promise.all([
			axiosClient.get("/users", { withCredentials: true }),
			axiosClient.get("/users/training/progress", {
				withCredentials: true,
			}),
		]);
		const userData = userRes.data.user;
		const progress = progressRes.data.progress;

		return { userData, progress };
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw Error(error.response?.data?.message || "Error fetching user data");
	}
}

export async function updateUser(updateData) {
	try {
		const { data } = await axiosClient.patch("/users", updateData, {
			withCredentials: true,
		});
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw Error(error.response?.data?.message || "Error updating user data");
	}
}

export async function deleteUser() {
	try {
		await axiosClient.delete("/users", { withCredentials: true });
		return;
	} catch (error) {
		console.log(error);
		throw Error("Error: something went wrong");
	}
}

export async function login(formData) {
	try {
		const payload = {
			email: formData.get("email"),
			password: formData.get("password"),
		};
		const { data } = await axiosClient.post("/users/login", payload);

		return { message: data.message };
	} catch (error) {
		console.log(error);
		return { error: "Error: something went wrong" };
	}
}

export async function verifyOTP(payload) {
	try {
		const { data } = await axiosClient.post("/users/verify", payload);

		return { token: data.token };
	} catch (error) {
		console.log(error);
		return {
			error: error.response?.data?.message || "Error: something went wrong",
		};
	}
}

export async function register(formData) {
	try {
		const { data } = await axiosClient.post("/users/register", formData);

		return { message: data.message };
	} catch (error) {
		console.log(error);
		return {
			error: error.response?.data?.message || "Error: something went wrong",
		};
	}
}
