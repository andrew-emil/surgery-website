import { useState, useEffect, useRef } from "react";
import "../main.css";
import {
	FormCard,
	FormContainer,
	FormTextField,
	FormTitle,
	FormButton,
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
	Typography,
	AlertTitle,
	Alert,
} from "@mui/material";
import RequirementProgress from "../components/RequirmentProgress";
import Requirments from "../components/Requirment";
import * as jose from "jose";

export default function MyAccount() {
	const firstnameRef = useRef();
	const lastnameRef = useRef();
	const emailRef = useRef();
	const newPasswordRef = useRef();
	const oldPasswordRef = useRef();
	const phoneRef = useRef();
	const confirmPasswordRef = useRef();

	const { user, setUser, setToken } = useStateContext();
	const [isPageLoading, setIsPageLoading] = useState(true);
	const [isButtonLoading, setIsButtonLoading] = useState(false);
	const [err, setErr] = useState("");
	const [msg, setMsg] = useState("");

	// User data states
	const [userData, setUserData] = useState(null);
	const [userProgress, setUserProgress] = useState(null);

	const [picture, setPicture] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const [userRes, progressRes] = await Promise.all([
					axiosClient.get("/users", { withCredentials: true }),
					axiosClient.get("/users/training/progress", {
						withCredentials: true,
					}),
				]);

				setUserData(userRes.data.user);
				setUserProgress(progressRes.data.progress);
			} catch (err) {
				console.error("Error fetching user data:", err);
			} finally {
				setIsPageLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const convertUserImage = (pic) => {
		const bytes = new Uint8Array(pic);
		const binaryString = String.fromCharCode(...bytes);
		const base64String = btoa(binaryString);
		const imageUrl = `data:image/jpeg;base64,${base64String}`;
		return imageUrl;
	};

	const onSubmit = async (ev) => {
		ev.preventDefault();
		setIsButtonLoading(true);
		setErr("");
		try {
			const password = newPasswordRef.current.value;
			const confirmPassword = confirmPasswordRef.current.value;
			if (password !== confirmPassword) {
				setErr("Passwords do not match");
				return;
			}
			const phone = phoneRef.current.value;
			if (phone && !/^\+[0-9]+$/.test(phone)) {
				setErr("Invalid phone number format");
				return;
			}

			const formData = new FormData();

			// Only append fields that have changed
			formData.append("first_name", firstnameRef.current.value);
			formData.append("last_name", lastnameRef.current.value);
			formData.append("email", emailRef.current.value);
			formData.append("phone_number", phone);

			let base64Image;
			if (picture) {
				base64Image = await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result);
					reader.onerror = (error) => reject(error);
					reader.readAsDataURL(picture);
				});

				formData.delete("picture");
			}

			if (password) {
				formData.append("old_password", oldPasswordRef.current.value);
				formData.append("new_password", password);
			}

			if (picture) {
				formData.append("picture", base64Image);
			}
			const secret = new TextEncoder().encode("mySecret1243");
			const { data } = await axiosClient.patch("/users", formData, {
				withCredentials: true,
			});

			const token = data.token;
			const result = await jose.jwtVerify(token, secret, {
				algorithms: ["HS256"],
			});

			setUser(result.payload);
			setToken(token);
			setMsg(data.message);
		} catch (err) {
			const response = err.response;
			if (response) {
				setErr(response.data.message);
			}
		} finally {
			setIsButtonLoading(false);
		}
	};

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
						alignItems: "center",
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
					{err && (
						<Alert severity="error" sx={{ marginBottom: "1rem" }}>
							<AlertTitle>Error</AlertTitle>
							{err}
						</Alert>
					)}
					{msg && (
						<Alert severity="success" sx={{ marginBottom: "1rem" }}>
							<AlertTitle>Success</AlertTitle>
							{msg}
						</Alert>
					)}
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
							inputRef={firstnameRef}
							type="text"
							label="First Name"
							name=""
							id="standard-basic"
							defaultValue={`${user.name.split(" ")[0]}`}
						/>
						<FormTextField
							inputRef={lastnameRef}
							type="text"
							label="Last Name"
							name=""
							id="standard-basic"
							defaultValue={`${user.name.split(" ")[1]}`}
						/>
						<FormTextField
							inputRef={emailRef}
							type="text"
							label="Email"
							name=""
							id="standard-basic"
							defaultValue={`${userData.email}`}
						/>
						<FormTextField
							inputRef={phoneRef}
							type="text"
							label="Phone Number"
							name=""
							id="standard-basic"
							defaultValue={`${userData.phone_number}`}
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
								label="Affiliation"
								value={userData.affiliation.id}
								disabled>
								<option
									key={userData.affiliation.id}
									value={userData.affiliation.id}>
									{userData.affiliation.name}
								</option>
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
								label="Department"
								disabled
								value={userData.department.id}>
								<option
									key={userData.department.id}
									value={userData.department.id}>
									{userData.department.name}
								</option>
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
								value={user.userRole}
								label="Role"
								disabled>
								<option>{user.userRole}</option>
							</NativeSelect>
						</FormControl>
					</Box>
					<hr />
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
						<Typography>{`Status: ${userProgress.overallStatus}`}</Typography>
						<RequirementProgress
							percentage={userProgress.completionPercentage}
						/>
						<Requirments requirments={userProgress.requirements} />
					</Box>
					<hr />
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
							Change password
						</FormTitle>
						<FormTextField
							inputRef={oldPasswordRef}
							type="password"
							label="old password"
							name=""
							id="standard-basic"
						/>
						<FormTextField
							inputRef={newPasswordRef}
							type="password"
							label="new password"
							name=""
							id="standard-basic"
						/>
						<FormTextField
							inputRef={confirmPasswordRef}
							type="password"
							label="confirm new password"
							name=""
							id="standard-basic"
						/>
					</Box>
					<FormButton
						sx={{
							width: "200px",
							maxWidth: "80%",
							mx: "auto",
							display: "flex",
							justifyContent: "center",
						}}
						variant="contained"
						className="btn btn-black"
						type="submit"
						loading={isButtonLoading}>
						Update account
					</FormButton>
				</FormCard>
			</form>
		</FormContainer>
	);
}
