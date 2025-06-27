import { fetchUserSurgeries } from "../services/apiSurgery";

export async function requestManagementLoader() {
	const surgeries = await fetchUserSurgeries();
	return surgeries;
}
