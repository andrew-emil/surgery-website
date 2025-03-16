import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  FormButton,
  FormCard,
  FormContainer,
  FormTextField,
  FormTitle,
} from "../components/StyledComponents";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/contextprovider";
import { Typography, Alert, AlertTitle } from "@mui/material";
export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [redirectToOTP, setRedirectToOTP] = useState(false);
  const { setMessage } = useStateContext();
  const [err, setErr] = useState(null);

  const submit = (ev) => {
    ev.preventDefault();
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    axiosClient
      .post("/users/login", payload)
      .then(({ data }) => {
        if (data.message === "OTP sent. Please verify to complete login.") {
          setMessage(payload.email);
          setRedirectToOTP(true);
        }
      })
      .catch((err) => {
        const response = err.response;
        console.log(err);
        if (response) {
          setErr(response.data.message);
        }
      });
  };
  if (redirectToOTP) {
    return <Navigate to="/otp" />;
  }
  return (
    <FormContainer>
      <FormCard>
        {err && (
          <Alert severity="error" sx={{ marginBottom: "1rem" }}>
            <AlertTitle>Error</AlertTitle>
            {err}
          </Alert>
        )}

        <FormTitle className="title">Login To Your Account</FormTitle>
        <form onSubmit={submit}>
          <FormTextField
            inputRef={emailRef}
            type="email"
            name=""
            id="standard-basic"
            label="Email"
            variant="standard"
            required
          />
          <FormTextField
            inputRef={passwordRef}
            type="password"
            name=""
            id="standard-basic"
            label="Password"
            variant="standard"
            required
          />
          <FormButton
            type="submit"
            variant="contained"
            className="btn btn-black btn-block"
          >
            Login
          </FormButton>
          <br />
          <Typography sx={{ textAlign: "center", marginTop: "1rem" }}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </Typography>
          <Typography
            variant="body2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
            className="message"
          >
            Not Registered? <Link to="/register">Create a new account</Link>
          </Typography>
        </form>
      </FormCard>
    </FormContainer>
  );
}
