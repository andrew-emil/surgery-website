import { useState, useEffect } from "react";
import { FormContainer } from "../components/StyledComponents";
import axiosClient from "../axiosClient";

export default function MyAccount() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		getUserData();
	});

	const getUserData = async () => {
		axiosClient
			.post("/users")
			.then(({ data }) => {
				setUser(data.user);
				console.log(user);
			})
			.catch((err) => {
				console.error(err);
			});
	};
	return <FormContainer>{user}</FormContainer>;
}
