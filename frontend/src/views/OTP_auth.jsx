import { Typography } from "@mui/material";
import { useState } from "react";
import { FormContainer, FormCard } from "../components/StyledComponents";

import { styled } from "@mui/material/styles";
import { FormTitle, FormButton } from "./../components/StyledComponents";
import OTPInput from "./../components/OTPInput";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/contextprovider";
import { Navigate } from "react-router-dom";

export default function OTP_auth() {
	const [otp, setOtp] = useState("");
	const StyledImg = styled("img")(({ theme }) => ({
		width: 100,
		height: 100,
		borderRadius: "50%",
		objectFit: "contain",
		border: `2px solid ${theme.palette.primary.main}`,
		boxShadow: theme.shadows[2],
		marginBottom: ".5rem",
	}));
	const { setUser, setToken, message, token } = useStateContext();
	if (!message) {
		return <Navigate to="/login" />;
	}
	const submit = (ev) => {
		ev.preventDefault();
		console.log(token, otp);
		axiosClient
			.post("/users/verify", { email: message, otp })
			.then(({ data }) => {
				console.log(data);
				// setUser(data.user);
				// setToken(data.token);
			});
		console.log(otp);
	};

	return (
		<FormContainer>
			<FormCard
				sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
				<StyledImg src="/images/Otp_Icon.svg"></StyledImg>
				<FormTitle>Verfication Code</FormTitle>
				<Typography
					variant="body2"
					className="message"
					sx={{ textAlign: "center" }}>
					We have sent a verification code to your email address. Please enter
					the code to verify your account.
				</Typography>
				<form onSubmit={submit} action="">
					<OTPInput otp={otp} setOtp={setOtp}></OTPInput>
					<FormButton
						type="submit"
						variant="contained"
						className="btn btn-black btn-block">
						Submit
					</FormButton>
				</form>
			</FormCard>
		</FormContainer>
	);
}
