import { fetchAffiliations } from "../services/apiAffiliation";
import { fetchRoles } from "../services/apiRoles";

export async function registerLoader() {
	try {
		const [{ roles }, { affiliations }] = await Promise.all([
			fetchRoles(),
			fetchAffiliations(),
		]);

		return { roles, affiliations };
	} catch (error) {
		console.log(error);
		throw Error("Something went wrong");
	}
}
