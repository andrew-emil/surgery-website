import { createEquipment } from "../services/apiSurgeryEquipment";

export async function createEquipmentAction({ request }) {
	const formData = await request.formData();
	const name = formData.get("name");
	const photo = formData.get("photo");

	try {
		const dataToSend = new FormData();
		dataToSend.append("name", name);

		if (photo && photo.size > 0) {
			const base64Image = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
				reader.readAsDataURL(photo);
			});
			dataToSend.append("photo", base64Image);
		}

		const { message, equipment } = await createEquipment(dataToSend);
		return { message, equipment };
	} catch (err) {
		const response = err.response;
		if (response) {
			return { error: response.data.message };
		}
		return { error: "An unexpected error occurred." };
	}
}
