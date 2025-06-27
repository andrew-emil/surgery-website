import { fetchUserSurgeries } from './../services/apiSurgery';

export async function homeLoader() {
	const surgeries = await fetchUserSurgeries();
	return surgeries;
}
