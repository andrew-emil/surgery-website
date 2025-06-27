import { fetchSurgeriesWithOpenSlots } from "../services/apiSurgery";

export async function openSlotsLoader() {
	const { surgeries } = await fetchSurgeriesWithOpenSlots();
	return surgeries;
}
