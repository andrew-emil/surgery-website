import { useRef, useState } from "react";
import {
  FormButton,
  FormCard,
  FormContainer,
  FormTextField,
  FormTitle,
} from "../components/StyledComponents";
import { Link, Navigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import AlertTitle from "@mui/material/AlertTitle";
import { Alert, Typography } from "@mui/material";
import { useStateContext } from "../context/contextprovider";

export default function Register() {
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const confirmPasswordRef = useRef();

  const [err, setErr] = useState(null);
  const [redirectToOTP, setRedirectToOTP] = useState(false);
  const { setMessage } = useStateContext();

  const submit = (ev) => {
    ev.preventDefault();
    if (passwordRef.current.value == confirmPasswordRef.current.value) {
      const payload = {
        first_name: firstnameRef.current.value,
        last_name: lastnameRef.current.value,
        email: emailRef.current.value,
        phone_number: `+${phoneRef.current.value}`,
        password: passwordRef.current.value,
        confirm_password: confirmPasswordRef.current.value,
      };
      axiosClient
        .post("/users/register", payload)
        .then(({ data }) => {
          if (data.message === "OTP sent. Please verify to complete login.") {
            setMessage(data.message);
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
    } else {
      setErr("Passwords do not match.");
      console.log(err);
    }
  };
  if (redirectToOTP) {
    return <Navigate to="/otp" />;
  }
  return (
    <FormContainer className="login-signup-form animated fadinDown">
      <FormCard className="form">
        <FormTitle variant="h1" className="title">
          Create A New Account
        </FormTitle>
        {err && (
          <Alert severity="error" sx={{ marginBottom: "1rem" }}>
            <AlertTitle>Error</AlertTitle>
            {err}
          </Alert>
        )}
        <form onSubmit={submit}>
          <FormTextField
            inputRef={firstnameRef}
            type="name"
            name=""
            id="standard-basic"
            label="First Name"
            variant="standard"
            required
          />
          <FormTextField
            inputRef={lastnameRef}
            type="name"
            name=""
            id="standard-basic"
            label="Last Name"
            variant="standard"
            required
          />
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
            inputRef={phoneRef}
            type="text"
            name=""
            id="standard-basic"
            label="Phone"
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
          <FormTextField
            inputRef={confirmPasswordRef}
            type="password"
            name=""
            id="standard-basic"
            label="Confirm Password"
            variant="standard"
            required
          />
          <FormButton
            variant="contained"
            className="btn btn-black"
            type="submit"
          >
            Sign-Up
          </FormButton>
        </form>
        <Typography
          variant="body2"
          className="message"
          sx={{ marginTop: "1rem", textAlign: "center" }}
        >
          Already Have An Account? <Link to="/login">Login</Link>
        </Typography>
      </FormCard>
    </FormContainer>
  );
}
