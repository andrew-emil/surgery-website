import { fetchSurgeryDetails } from "../../services/apiSurgery";

export async function loader({ params }, queryClient) {
	const { queryKey, queryFn } = fetchSurgeryDetails(params.surgeryId);
	const surgery = queryClient.ensureQueryData({ queryKey, queryFn });
	return surgery;
}
