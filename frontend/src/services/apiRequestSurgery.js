import axiosClient from "./../axiosClient";

export async function requestForSurgery(dataToSend) {
	try {
		await axiosClient.post("/auth-requests", dataToSend, {
			withCredentials: true,
		});
	} catch (error) {
		console.log(error);
		throw Error(error.response?.data?.message || "Error adding request");
	}
}

export async function fetchSurgeryRequests(surgeryId) {
	try {
		const { data } = await axiosClient.get(
			`/auth-requests/${surgeryId}/request`,
			{ withCredentials: true }
		);

		return data.requests;
	} catch (error) {
		console.log(error);
		throw Error(error.response?.data?.message || "Error fetching requests");
	}
}

export async function handleApproveOrRejectRequest(isApproved, id) {
	try {
		const { data } = await axiosClient.patch(
			`/auth-requests/${id}/${isApproved ? "approve" : "reject"}`,
			{ withCredentials: true }
		);

		return {message: data.message};
	} catch (error) {
		console.log(error);
		return {
			error:
				error.response?.data?.message || isApproved
					? "Error approving request"
					: "Error rejecting request",
		};
	}
}
