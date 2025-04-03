import { useState, useEffect } from "react";
import { FormCard, FormContainer } from "../components/StyledComponents";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/contextprovider";
import { Avatar, Skeleton } from "@mui/material";

export default function MyAccount() {
	const [userData, setUserData] = useState(null);
	const [userProgress, setUserProgress] = useState(null);
	const [userRoleRequirment, setUserRoleRequirment] = useState(null);
	const [isPageLoading, setIsPageLoading] = useState(true);
	const { token, user } = useStateContext();

	useEffect(() => {
		setIsPageLoading(true);
		axiosClient
			.get("/users/", { withCredentials: true })
			.then(({ data }) => {
				setUserData(data.user);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => setIsPageLoading(false));
	}, []);
	useEffect(() => {
		setIsPageLoading(true);
		axiosClient
			.get("/users/training/progress", { withCredentials: true })
			.then(({ data }) => {
				setUserProgress(data.progress);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => setIsPageLoading(false));
	}, []);
	useEffect(() => {
		setIsPageLoading(true);
		axiosClient
			.get("/users/roles/requirements", { withCredentials: true })
			.then(({ data }) => {
				setUserRoleRequirment(data.requirements);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => setIsPageLoading(false));
	}, []);

	const convertUserImage = (pic) => {
		// eslint-disable-next-line no-undef
		const base64String = Buffer.from(pic).toString("base64");
		const imageUrl = `data:image/jpeg;base64,${base64String}`;
		return imageUrl;
	};

	if (isPageLoading) {
		return (
			<FormContainer>
				<Skeleton variant="rounded" width={720} height={526} />
			</FormContainer>
		);
	}
	return (
		<FormContainer>
			{
				<Avatar
					alt={`${userData.first_name}`}
					src={convertUserImage(user.picture.data)}
					sx={{ width: 60, height: 60 }}
				/>
			}
			
		</FormContainer>
	);
}
