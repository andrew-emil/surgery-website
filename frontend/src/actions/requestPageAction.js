import { redirect } from "react-router";
import {requestForSurgery} from "../services/apiRequestSurgery";

export async function requestPageAction({ request }) {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	try {
		await requestForSurgery(data);
		return redirect("/surgeries-open-slots");
	} catch (err) {
		return { error: err || "Submission failed" };
	}
}
