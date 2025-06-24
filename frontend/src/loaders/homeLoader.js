import { fetchUserSurgeries } from './../services/apiSurgery';

export async function loader(queryClient) {
	const { queryKey, queryFn } = fetchUserSurgeries();
	const surgeries = await queryClient.ensureQueryData({ queryKey, queryFn });
	return surgeries;
}
