import { useState, useEffect } from "react";
import { FormCard, FormContainer } from "../components/StyledComponents";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/contextprovider";
import { Skeleton } from "@mui/material";

export default function MyAccount() {
	const [userData, setUserData] = useState(null);
	const [userProgress, setUserProgress] = useState(null);
	const [userRoleRequirment, setUserRoleRequirment] = useState(null);
	const [isPageLoading, setIsPageLoading] = useState(true);
	const { user } = useStateContext();

	useEffect(() => {
		setIsPageLoading(true);
		axiosClient
			.get("/users/")
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
			.get("/users/training/progress")
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
			.get("/roles/requirements")
			.then(({ data }) => {
				setUserRoleRequirment(data.requirements);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => setIsPageLoading(false));
	}, []);

	if (isPageLoading) {
		return (
			<FormContainer>
				<Skeleton variant="rounded" width={720} height={526} />
			</FormContainer>
		);
	}
	return (
		<FormContainer>
			<FormCard>{user}</FormCard>
			<FormCard>{userData}</FormCard>
			<FormCard>{userProgress}</FormCard>
			<FormCard>{userRoleRequirment}</FormCard>
		</FormContainer>
	);
}
