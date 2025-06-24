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
