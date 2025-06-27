import {
	Alert,
	AlertTitle,
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
	Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
	Link,
	useLoaderData,
	useNavigate,
	useNavigation,
	Form,
	useActionData,
} from "react-router";
import axiosClient from "../../axiosClient";
import DarkModeButton from "../../components/darkmodeButton";
import {
	FormButton,
	FormCard,
	FormContainer,
	FormTextField,
	FormTitle,
} from "../../components/StyledComponents";
import { convertImage } from "../../utils/convertImage";

export default function Register() {
	const { roles, affiliations } = useLoaderData();

	const { state } = useNavigation();
	const navigate = useNavigate();

	const [err, setErr] = useState(null);
	const [affiliation, setAffiliation] = useState(null);
	const [department, setDepartment] = useState("");
	const [picture, setPicture] = useState(null);
	const [role, setRole] = useState("");
	const [departmentData, setDepartmentData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [imagePreview, setImagePreview] = useState(null);

	const actionData = useActionData();

	const handleAffiliationChange = (event) => {
		setAffiliation(event.target.value);
		setDepartment("");
	};

	const handleDepartmentChange = (event) => {
		setDepartment(event.target.value);
	};

	const handleRoleChange = (event) => {
		setRole(event.target.value);
	};

	const handlePictureChange = (e) => {
		const file = e.target.files[0];
		setPicture(file);
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImagePreview(reader.result);
			};
			reader.readAsArrayBuffer(file);
		}
	};

	useEffect(() => {
		if (affiliation) {
			axiosClient
				.get(`/departments/${affiliation}`)
				.then(({ data }) => {
					setDepartmentData(data.departments);
				})
				.catch(() => setDepartmentData([]));
		} else {
			setDepartmentData([]);
		}
	}, [affiliation]);

	useEffect(() => {
		if (picture) {
			const reader = new FileReader();
			reader.onload = () => {
				setImagePreview(convertImage(new Uint8Array(reader.result)));
			};
			reader.readAsArrayBuffer(picture);
		}
	}, [picture]);

	useEffect(() => {
		if (state === "submitting" || state === "loading") setIsLoading(true);
		else {
			setIsLoading(false);
		}
	}, [state]);

	useEffect(() => {
		if (actionData.error) {
			setErr(actionData.error);
		} else if (actionData.message) {
			navigate(`/otp?email=${actionData.email}`);
		}
	}, [actionData, navigate]);

	return (
		<FormContainer
			sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
			<FormCard
				variant={"register"}
				className="form"
				sx={{ maxHeight: "200vh" }}>
				{err && (
					<Alert severity="error" sx={{ marginBottom: "1rem" }}>
						<AlertTitle>Error</AlertTitle>
						{err}
					</Alert>
				)}
				<Form method="POST" encType="multipart/form-data">
					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", sm: "row" },
							gap: "1rem",
						}}>
						<Box sx={{ width: "50%" }}>
							<FormTitle variant="h1" className="title">
								Personal Information
							</FormTitle>
							<FormTextField
								type="name"
								name="first_name"
								id="standard-basic"
								label="First Name"
								variant="standard"
								required
							/>
							<FormTextField
								type="name"
								name="last_name"
								id="standard-basic"
								label="Last Name"
								variant="standard"
								required
							/>
							<FormTextField
								type="email"
								name="email"
								id="standard-basic"
								label="Email"
								variant="standard"
								required
							/>
							<FormTextField
								type="text"
								name="phone"
								id="standard-basic"
								label="Phone"
								variant="standard"
								required
							/>
							<FormTextField
								type="password"
								name="password"
								id="standard-basic"
								label="Password"
								variant="standard"
								required
							/>
							<FormTextField
								type="password"
								name="confirm_password"
								id="standard-basic"
								label="Confirm Password"
								variant="standard"
								required
							/>
							<Box
								sx={{
									marginTop: "1rem",
									marginBottom: "1rem",
									display: "flex",
									alignItems: "center",
									gap: 2,
								}}>
								<InputLabel shrink htmlFor="picture-upload">
									Upload Picture
								</InputLabel>
								<input
									id="picture-upload"
									type="file"
									accept="image/*"
									onChange={handlePictureChange}
								/>
								{imagePreview && (
									<Avatar
										src={imagePreview}
										alt="Preview"
										sx={{ width: 56, height: 56 }}
									/>
								)}
							</Box>
						</Box>
						<Box sx={{ width: "50%" }}>
							<FormTitle variant="h1" className="title">
								Professional Details
							</FormTitle>
							<FormControl variant="standard" sx={{ minWidth: "100%" }}>
								<InputLabel id="demo-simple-select-standard-label">
									Affiliations
								</InputLabel>
								<Select
									labelId="demo-simple-select-standard-label"
									id="demo-simple-select-standard"
									value={affiliation}
									onChange={handleAffiliationChange}
									label="Affiliation">
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{affiliations.map((aff) => (
										<MenuItem key={aff.id} value={aff.id}>
											{aff.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<FormControl
								variant="standard"
								sx={{ minWidth: "100%", marginTop: "1rem" }}>
								<InputLabel id="demo-simple-select-standard-label">
									Departments
								</InputLabel>
								<Select
									labelId="demo-simple-select-standard-label"
									id="demo-simple-select-standard"
									value={department}
									onChange={handleDepartmentChange}
									label="Department"
									disabled={departmentData.length === 0}>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{departmentData.length > 0 &&
										departmentData.map((dep) => (
											<MenuItem key={dep.id} value={dep.id}>
												{dep.name}
											</MenuItem>
										))}
								</Select>
							</FormControl>
							<FormControl
								variant="standard"
								sx={{ minWidth: "100%", marginTop: "1rem" }}>
								<InputLabel id="demo-simple-select-standard-label">
									Roles
								</InputLabel>
								<Select
									labelId="demo-simple-select-standard-label"
									id="demo-simple-select-standard"
									value={role}
									onChange={handleRoleChange}
									label="Role">
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{roles.map((r) => (
										<MenuItem key={r.id} value={r.id}>
											{r.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					</Box>
					<FormButton
						variant="contained"
						className="btn btn-black"
						type="submit"
						loading={isLoading}>
						Sign-Up
					</FormButton>
				</Form>
				<Typography
					variant="body2"
					className="message"
					sx={{ marginTop: "1rem", textAlign: "center" }}>
					Already Have An Account? <Link to="/login">Login</Link>
				</Typography>
			</FormCard>
			<DarkModeButton></DarkModeButton>
		</FormContainer>
	);
}
