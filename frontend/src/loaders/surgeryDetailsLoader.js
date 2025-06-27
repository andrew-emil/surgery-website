import { fetchSurgeryDetails } from "../services/apiSurgery";

export async function loader({ params }) {
	const surgery = await fetchSurgeryDetails(params.surgeryId);
	return surgery;
}
