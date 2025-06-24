import { fetchUserData } from "../services/apiUser";

export async function accountLoader() {
	const { userData, progress } = await fetchUserData();
	return { userData, progress };
}
