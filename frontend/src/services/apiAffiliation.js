import axiosClient from "../axiosClient";

export async function fetchAffiliations() {
	try {
		const { data } = await axiosClient.get("/affiliation");

		return { affiliations: data.affiliations };
	} catch (error) {
		console.log(error);
		return {
			error: error.response?.data?.message || "Error fetching Affiliations",
		};
	}
}
