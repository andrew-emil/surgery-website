import { useState, useEffect } from "react";
import "../main.css";
import {
	FormCard,
	FormContainer,
	FormTextField,
	FormTitle,
} from "../components/StyledComponents";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/contextprovider";
import {
	Avatar,
	Skeleton,
	Box,
	InputLabel,
	FormControl,
	NativeSelect,
} from "@mui/material";

export default function MyAccount() {
	const [userData, setUserData] = useState(null);
	const [userProgress, setUserProgress] = useState(null);
	const [userRoleRequirment, setUserRoleRequirment] = useState(null);
	const [isPageLoading, setIsPageLoading] = useState(true);
	const [picture, setPicture] = useState(null);

	const [isButtonloading, setIsButtonLoading] = useState(false);
	const [affiliation, setAffiliation] = useState(null);
	const [department, setDepartment] = useState("");
	const [role, setRole] = useState("");
	const [affiliationData, setAffiliationData] = useState([]);
	const [roleData, setRoleData] = useState([]);
	const [departmentData, setDepartmentData] = useState([]);
	const { user } = useStateContext();

	useEffect(() => {
		setIsPageLoading(true);
		axiosClient
			.get("/users/", { withCredentials: true })
			.then(({ data }) => {
				setUserData(data.user);
				console.log(data.user)
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setIsPageLoading(false);
			});
	}, []);
	useEffect(() => {
		setIsPageLoading(true);
		axiosClient
			.get("/users/training/progress", { withCredentials: true })
			.then(({ data }) => {
				setUserProgress(data.progress);
				console.log(data.progress)
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
	useEffect(() => {
		setIsPageLoading(true);
		axiosClient
			.get("/affiliation")
			.then(({ data }) => {
				setAffiliationData(data.affiliations);
				setIsPageLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	useEffect(() => {
		setIsPageLoading(true);
		axiosClient
			.get("/roles")
			.then(({ data }) => {
				setRoleData(data.data);
				setIsPageLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	useEffect(() => {
		if (userData) {
			axiosClient
				.get(`/departments/${userData.affiliation.id}`)
				.then(({ data }) => {
					setDepartmentData(data.departments);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			console.log("Affiliation is not yet available.");
		}
	}, [userData]);

	const convertUserImage = (pic) => {
		const bytes = new Uint8Array(pic);
		const binaryString = String.fromCharCode(...bytes);
		const base64String = btoa(binaryString);
		const imageUrl = `data:image/jpeg;base64,${base64String}`;
		return imageUrl;
	};

	const handleAffiliationChange = (event) => {
		setAffiliation(event.target.value);
	};
	const handleDepartmentChange = (event) => {
		setDepartment(event.target.value);
	};
	const handleRoleChange = (event) => {
		setRole(event.target.value);
	};

	const onSubmit = (ev) => {};

	if (isPageLoading) {
		return (
			<FormContainer>
				<Skeleton variant="rounded" />
			</FormContainer>
		);
	}
	return (
		<FormContainer sx={{ display: "flex", flexDirection: "column" }}>
			<FormTitle variant="h1" className="title">
				My Account
			</FormTitle>
			<form onSubmit={onSubmit} className="account-form">
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center", // Center children horizontally
						gap: "1rem",
						width: "100%",
					}}>
					<Box sx={{ marginY: "1rem" }}>
						<Avatar
							sx={{ width: 100, height: 100 }}
							src={
								picture
									? URL.createObjectURL(picture)
									: userData?.picture?.data
										? convertUserImage(userData.picture.data)
										: null
							}
						/>
						<input
							id="picture-upload"
							type="file"
							accept="image/*"
							onChange={(e) => {
								setPicture(e.target.files[0]);
								console.log(e.target.files);
							}}
						/>
					</Box>
				</Box>
				<FormCard sx={{ width: "100%" }}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							marginBottom: "1rem",
							gap: "1rem",
							alignItems: "flex-start",
							width: "90%",
						}}>
						<FormTitle variant="h1" className="title">
							Personal Information
						</FormTitle>
						<FormTextField
							type="text"
							label="First Name"
							name=""
							id="standard-basic"
							defaultValue={`${user.name.split(" ")[0]}`}
							required
						/>
						<FormTextField
							type="text"
							label="Last Name"
							name=""
							id="standard-basic"
							defaultValue={`${user.name.split(" ")[1]}`}
							required
						/>
						<FormTextField
							type="text"
							label="Email"
							name=""
							id="standard-basic"
							defaultValue={`${userData.email}`}
							required
						/>
						<FormTextField
							type="text"
							label="Phone Number"
							name=""
							id="standard-basic"
							defaultValue={`${userData.phone_number}`}
							required
						/>
					</Box>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							marginY: "2rem",
							gap: "1rem",
							alignItems: "flex-start",
							width: "90%",
						}}>
						<FormTitle variant="h1" className="title">
							Professional Details
						</FormTitle>
						<FormControl variant="standard" sx={{ width: "50%" }}>
							<InputLabel id="demo-simple-select-standard-label">
								Affiliations
							</InputLabel>
							<NativeSelect
								labelId="demo-simple-select-standard-label"
								id="demo-simple-select-standard"
								value={affiliation}
								onChange={handleAffiliationChange}
								label="Affiliation"
								defaultValue={userData.affiliation.id}>
								{affiliationData.map((affiliation) => (
									<option key={affiliation.id} value={affiliation.id}>
										{affiliation.name}
									</option>
								))}
							</NativeSelect>
						</FormControl>
						<FormControl
							variant="standard"
							sx={{ width: "50%", marginTop: "1rem" }}>
							<InputLabel id="demo-simple-select-standard-label">
								Departments
							</InputLabel>
							<NativeSelect
								labelId="demo-simple-select-standard-label"
								id="demo-simple-select-standard"
								value={department}
								onChange={handleDepartmentChange}
								label="Department"
								disabled={departmentData.length === 0}
								defaultValue={`${userData.department.name}`}>
								{departmentData.length > 0 ? (
									departmentData.map((department) => (
										<option key={department.id} value={department.id}>
											{department.name}
										</option>
									))
								) : (
									<option></option>
								)}
							</NativeSelect>
						</FormControl>
						<FormControl
							variant="standard"
							sx={{ width: "50%", marginTop: "1rem" }}>
							<InputLabel id="demo-simple-select-standard-label">
								Roles
							</InputLabel>
							<NativeSelect
								labelId="demo-simple-select-standard-label"
								id="demo-simple-select-standard"
								value={role}
								onChange={handleRoleChange}
								label="Department">
								{roleData.map((role) => (
									<option key={role.id} value={role.id}>
										{role.name}
									</option>
								))}
							</NativeSelect>
						</FormControl>
					</Box>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							marginY: "2rem",
							gap: "1rem",
							alignItems: "flex-start",
							width: "90%",
						}}>
						<FormTitle variant="h1" className="title">
							Doctor Progress
						</FormTitle>
						</Box>
				</FormCard>
			</form>
		</FormContainer>
	);
}
