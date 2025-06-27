import { Alert, AlertTitle, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import {
	Link,
	Form,
	useActionData,
	useNavigation,
	useNavigate,
} from "react-router";
import DarkModeButton from "../../components/darkmodeButton";
import {
	FormButton,
	FormCard,
	FormContainer,
	FormTextField,
	FormTitle,
} from "../../components/StyledComponents";

export default function Login() {
	const actionData = useActionData();
	const navigate = useNavigation();
	const nav = useNavigate();
	const [err, setErr] = useState(null);
	const [isLoading] = useState(navigate.state === "loading");

	useEffect(() => {
		if (actionData && actionData.error) {
			setErr(actionData.error);
		}
		if (actionData && actionData.success) {
			nav(`/otp?email=${actionData.email}`);
		}
	}, [actionData, nav]);

	return (
		<FormContainer sx={{ display: "flex", flexDirection: "column" }}>
			<FormCard>
				{err && (
					<Alert severity="error" sx={{ marginBottom: "1rem" }}>
						<AlertTitle>Error</AlertTitle>
						{err}
					</Alert>
				)}

				<FormTitle className="title">Login To Your Account</FormTitle>
				<Form method="post" className="account-form">
					<FormTextField
						type="email"
						name="email"
						id="standard-basic"
						label="Email"
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
					<FormButton
						type="submit"
						variant="contained"
						className="btn btn-black btn-block"
						loading={isLoading}>
						Login
					</FormButton>
					<br />
					<Typography sx={{ textAlign: "center", marginTop: "1rem" }}>
						<Link to="/forgot-password">Forgot Password?</Link>
					</Typography>
					<Typography
						variant="body2"
						sx={{ marginTop: "1rem", textAlign: "center" }}
						className="message">
						Not Registered? <Link to="/register">Create a new account</Link>
					</Typography>
				</Form>
			</FormCard>
			<DarkModeButton></DarkModeButton>
		</FormContainer>
	);
}
