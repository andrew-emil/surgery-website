import { Alert, AlertTitle, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import OTPInput from "../../components/OTPInput";
import {
	FormButton,
	FormCard,
	FormContainer,
	FormTitle,
	StyledImg,
} from "../../components/StyledComponents";
import { useStateContext } from "../../context/contextprovider";
import { verifyOTP } from "../../services/apiUser";

export default function OTP_auth() {
	const [otp, setOtp] = useState("");
	const [err, setErr] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [searchParams] = useSearchParams();
	const email = searchParams.get("email");
	const navigate = useNavigate();

	const { setToken } = useStateContext();

	const submit = async (ev) => {
		ev.preventDefault();
		setIsLoading(true);
		setErr("");
		const payload = {
			email,
			otp,
		};
		const result = await verifyOTP(payload);
		if (result.error) {
			setErr(result.error);
			setIsLoading(false);
			return;
		}
		const { token } = result;
		setToken(token);
		setIsLoading(false);
		navigate("/");
	};

	return (
		<FormContainer>
			<FormCard
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					padding: "3rem",
					width: "28rem",
				}}>
				{err && (
					<Alert severity="error" sx={{ marginBottom: "1rem", width: "26rem" }}>
						<AlertTitle>Error</AlertTitle>
						{err}
					</Alert>
				)}
				<StyledImg
					sx={{ marginTop: "2rem" }}
					src="/images/Otp_Icon.svg"></StyledImg>
				<FormTitle>Verification Code</FormTitle>
				<Typography
					variant="body2"
					className="message"
					sx={{ textAlign: "center", marginBottom: "1rem" }}>
					We have sent a verification code to your email address. Please enter
					the code to verify your account.
				</Typography>
				<form onSubmit={submit}>
					<OTPInput otp={otp} setOtp={setOtp}></OTPInput>
					<FormButton
						type="submit"
						variant="contained"
						className="btn btn-black btn-block"
						sx={{ width: "100%", marginTop: "1rem", marginBottom: "2rem" }}
						loading={isLoading}
						disabled={!otp && isLoading}>
						Submit
					</FormButton>
				</form>
			</FormCard>
		</FormContainer>
	);
}
