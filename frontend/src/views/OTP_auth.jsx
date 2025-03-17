import { Typography } from "@mui/material";
import { useState } from "react";
import { FormContainer, FormCard } from "../components/StyledComponents";
import { styled } from "@mui/material/styles";
import { FormTitle, FormButton } from "./../components/StyledComponents";
import OTPInput from "./../components/OTPInput";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/contextprovider";
import { Navigate } from "react-router-dom";
import * as jose from "jose";

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
  const { setUser, setToken, message } = useStateContext();

  if (!message) {
    return <Navigate to="/login" />;
  }
  const secretKey = import.meta.env.VITE_JWT_SECRET;
  const secret = new TextEncoder().encode(secretKey);
  const submit = (ev) => {
    ev.preventDefault();
    const payload = {
      email: message,
      otp: otp,
    };
    axiosClient.post("/users/verify", payload).then(({ data }) => {
      const token = data.token;
      jose
        .jwtVerify(token, secret, { algorithms: ["HS256"] })
        .then((result) => {
          setUser(result.payload);
          setToken(token);
        });
    });
    console.log(otp);
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
        }}
      >
        <StyledImg
          sx={{ marginTop: "2rem" }}
          src="/images/Otp_Icon.svg"
        ></StyledImg>
        <FormTitle>Verfication Code</FormTitle>
        <Typography
          variant="body2"
          className="message"
          sx={{ textAlign: "center", marginBottom: "1rem" }}
        >
          We have sent a verification code to your email address. Please enter
          the code to verify your account.
        </Typography>
        <form onSubmit={submit} action="">
          <OTPInput otp={otp} setOtp={setOtp}></OTPInput>
          <FormButton
            type="submit"
            variant="contained"
            className="btn btn-black btn-block"
            sx={{ width: "100%", marginTop: "1rem", marginBottom: "2rem" }}
          >
            Submit
          </FormButton>
        </form>
      </FormCard>
    </FormContainer>
  );
}
