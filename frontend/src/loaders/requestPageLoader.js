import { fetchSurgicalRoles } from "../services/apiSurgery";

export async function requestPageLoader() {
	const surgicalRoles = await fetchSurgicalRoles();
	return surgicalRoles;
}
