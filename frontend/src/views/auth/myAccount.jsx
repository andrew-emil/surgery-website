import {
	Alert,
	AlertTitle,
	Avatar,
	Box,
	FormControl,
	InputLabel,
	NativeSelect,
	Skeleton,
	Typography,
} from "@mui/material";
import { useState, useRef } from "react";
import {
	Form,
	useActionData,
	useLoaderData,
	useNavigation,
} from "react-router";
import Requirements from "../../components/auth/Requirements";
import RequirementProgress from "../../components/auth/RequirementProgress";
import {
	FormButton,
	FormCard,
	FormContainer,
	FormTextField,
	FormTitle,
} from "../../components/StyledComponents";
import { useStateContext } from "../../context/contextprovider";
import { convertImage } from "../../utils/convertImage";
import { getFieldError } from "../../utils/getFieldError";

import "../../main.css";

export default function MyAccount() {
	const { setToken } = useStateContext();
	const { userData, progress } = useLoaderData();
	const actionData = useActionData();
	const navigate = useNavigation();
	const [picture, setPicture] = useState(null);
	const deleteFormRef = useRef();

	// Delete confirmation handler
	const handleDelete = (e) => {
		e.preventDefault();
		if (
			window.confirm(
				"Are you sure you want to delete your account? This action cannot be undone."
			)
		) {
			deleteFormRef.current.requestSubmit();
		}
	};

	if (navigate.state === "loading") {
		return (
			<FormContainer>
				<Skeleton variant="rounded" />
			</FormContainer>
		);
	}

	const { token } = actionData;
	setToken(token);

	return (
		<FormContainer sx={{ display: "flex", flexDirection: "column" }}>
			<FormTitle variant="h1" className="title">
				My Account
			</FormTitle>
			<Form
				encType="multipart/form-data"
				method="post"
				className="account-form">
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
										? convertImage(userData.picture.data)
										: null
							}
						/>
						<input
							id="picture-upload"
							type="file"
							accept="image/*"
							name="picture"
							onChange={(e) => {
								setPicture(e.target.files[0]);
							}}
						/>
					</Box>
				</Box>
				<FormCard sx={{ width: "100%" }}>
					{/* General error */}
					{typeof actionData?.error === "string" && (
						<Alert severity="error" sx={{ marginBottom: "1rem" }}>
							<AlertTitle>Error</AlertTitle>
							{actionData.error}
						</Alert>
					)}
					{actionData?.message && (
						<Alert severity="success" sx={{ marginBottom: "1rem" }}>
							<AlertTitle>Success</AlertTitle>
							{actionData.message}
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
							type="text"
							label="First Name"
							name="first_name"
							id="first_name"
							defaultValue={userData.name.split(" ")[0]}
							error={!!getFieldError(actionData, "first_name")}
							helperText={getFieldError(actionData, "first_name")}
						/>
						<FormTextField
							type="text"
							label="Last Name"
							name="last_name"
							id="last_name"
							defaultValue={userData.name.split(" ")[1]}
							error={!!getFieldError(actionData, "last_name")}
							helperText={getFieldError(actionData, "last_name")}
						/>
						<FormTextField
							type="text"
							label="Email"
							name="email"
							id="email"
							defaultValue={userData.email}
							error={!!getFieldError(actionData, "email")}
							helperText={getFieldError(actionData, "email")}
						/>
						<FormTextField
							type="text"
							label="Phone Number"
							name="phone_number"
							id="phone_number"
							defaultValue={userData.phone_number}
							error={!!getFieldError(actionData, "phone_number")}
							helperText={getFieldError(actionData, "phone_number")}
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
							<InputLabel id="affiliation-label">Affiliations</InputLabel>
							<NativeSelect
								labelId="affiliation-label"
								id="affiliation"
								label="Affiliation"
								value={userData.affiliation.id}
								disabled
								name="affiliation">
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
							<InputLabel id="department-label">Departments</InputLabel>
							<NativeSelect
								labelId="department-label"
								id="department"
								label="Department"
								disabled
								value={userData.department.id}
								name="department">
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
							<InputLabel id="role-label">Roles</InputLabel>
							<NativeSelect
								labelId="role-label"
								id="role"
								value={userData.userRole}
								label="Role"
								disabled
								name="role">
								<option>{userData.userRole}</option>
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
						<Typography>{`Status: ${progress.overallStatus}`}</Typography>
						<RequirementProgress percentage={progress.completionPercentage} />
						<Requirements requirements={progress.requirements} />
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
							type="password"
							label="old password"
							name="old_password"
							id="old_password"
							error={!!getFieldError(actionData, "old_password")}
							helperText={getFieldError(actionData, "old_password")}
						/>
						<FormTextField
							type="password"
							label="new password"
							name="new_password"
							id="new_password"
							error={!!getFieldError(actionData, "new_password")}
							helperText={getFieldError(actionData, "new_password")}
						/>
						<FormTextField
							type="password"
							label="confirm new password"
							name="confirm_password"
							id="confirm_password"
							error={!!getFieldError(actionData, "confirm_password")}
							helperText={getFieldError(actionData, "confirm_password")}
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
						type="submit">
						Update account
					</FormButton>
				</FormCard>
			</Form>
			{/* Delete form for confirmation */}
			<Form method="post" ref={deleteFormRef} style={{ display: "none" }}>
				<input type="hidden" name="intent" value="delete" />
			</Form>
			<FormButton
				sx={{
					width: "200px",
					maxWidth: "80%",
					mx: "auto",
					mt: 2,
					display: "flex",
					justifyContent: "center",
					color: "red",
				}}
				className="btn btn-red"
				onClick={handleDelete}>
				Delete Account
			</FormButton>
		</FormContainer>
	);
}
