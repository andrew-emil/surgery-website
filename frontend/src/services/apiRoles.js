import axiosClient from "../axiosClient";

export async function fetchRoles() {
	try {
		const { data } = axiosClient.get("/roles");

		return { roles: data.roles };
	} catch (error) {
		console.log(error);
		return { error: error.response?.data?.message || "Error fetching roles" };
	}
}
