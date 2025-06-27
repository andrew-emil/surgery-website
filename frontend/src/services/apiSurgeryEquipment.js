import axiosClient from "./../axiosClient";

export async function createEquipment(equipmentData) {
	try {
		const { data } = await axiosClient.post(
			"/surgery-equipments",
			equipmentData,
			{
				withCredentials: true,
			}
		);
		const { message, equipment } = data;

		return { message, equipment };
	} catch (error) {
		console.log("Error creating equipment: ", error);
		throw Error(error.response?.data?.message || "Error creating equipment");
	}
}
