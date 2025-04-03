import { Typography, Alert, AlertTitle } from "@mui/material";
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
  const [err, setErr] = useState(null);
  //   const [redirectToHome, setRediredtToHome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const StyledImg = styled("img")(({ theme }) => ({
    width: 100,
    height: 100,
    borderRadius: "50%",
    objectFit: "contain",
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: theme.shadows[2],
    marginBottom: ".5rem",
  }));
  const { setUser, setToken, user } = useStateContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // const secretKey = import.meta.env.VITE_JWT_SECRET;
  const secret = new TextEncoder().encode("mySecret1243");
  const submit = (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    setErr("");
    const payload = {
      email: user,
      otp: otp,
    };

    axiosClient
      .post("/users/verify", payload)
      .then(({ data }) => {
        const token = data.token;
        jose
          .jwtVerify(token, secret, { algorithms: ["HS256"] })
          .then((result) => {
            setUser(result.payload);
            setToken(token);
            // setRediredtToHome(true);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        const response = err.response;
        if (response) {
          setErr(response.data.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // if (redirectToHome) {
  // 	return <Navigate to="/home" />;
  // }

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
        {err && (
          <Alert severity="error" sx={{ marginBottom: "1rem", width: "26rem" }}>
            <AlertTitle>Error</AlertTitle>
            {err}
          </Alert>
        )}
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
            loading={isLoading}
          >
            Submit
          </FormButton>
        </form>
      </FormCard>
    </FormContainer>
  );
}
