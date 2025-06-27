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
		throw Error(error.response?.data?.message || "Error fetching surgery");
	}
}

export async function fetchSurgeriesWithOpenSlots() {
	try {
		const { data } = await axiosClient.get("/surgery/open-slots", {
			withCredentials: true,
		});
		const { surgeries, pagination } = data;

		return { surgeries, pagination };
	} catch (err) {
		console.log(err);
		throw Error(err.response?.data?.message || "Error fetching surgeries");
	}
}

export async function fetchSurgicalRoles() {
	try {
		const { data } = await axiosClient.get("/surgical-role", {
			withCredentials: true,
		});

		return data;
	} catch (err) {
		throw Error(err.response?.data?.message || "error fetching data");
	}
}
