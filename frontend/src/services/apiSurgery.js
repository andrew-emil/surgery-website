import axiosClient from "./../axiosClient";

export async function fetchUserSurgeries() {
	try {
		const response = await axiosClient.get("/surgery/surgeries", {
			withCredentials: true,
		});
		const { surgeries } = response.data;
		return surgeries;
	} catch (error) {
		throw Error(error.response?.data?.message || "error fetching surgeries");
	}
}

export async function fetchSurgeryDetails(surgeryId) {
	try {
		const response = await axiosClient.get(
			`/surgery/get-surgery/${surgeryId}`,
			{ withCredentials: true }
		);

		const { surgery } = response.data;
		return surgery;
	} catch (error) {
		throw Error(error.response?.data?.message || "error fetching surgery");
	}
}
