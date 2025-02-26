import { useRef, useState } from "react";
import {
  FormButton,
  FormCard,
  FormContainer,
  FormTextField,
  FormTitle,
} from "../components/StyledComponents";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/contextprovider";
import AlertTitle from "@mui/material/AlertTitle";
import { Alert, Typography } from "@mui/material";

export default function Register() {
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const confirmPasswordRef = useRef();

  const [err, setErr] = useState(null);
  const { setUser, setToken } = useStateContext();

  const submit = (ev) => {
    ev.preventDefault();
    if (passwordRef.current.value == confirmPasswordRef.current.value) {
      const payload = {
        firstname: firstnameRef.current.value,
        lastname: lastnameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        password: passwordRef.current.value,
      };
      axiosClient
        .post("/register", payload)
        .then(({ data }) => {
          setUser(data.user);
          setToken(data.token);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            console.log(response.data.errors);
          }
        });
    } else {
      setErr({ passwordConfirmation: "Passwords do not match." });
      console.log(err);
    }
  };
  return (
    <FormContainer className="login-signup-form animated fadinDown">
      <FormCard className="form">
        <FormTitle variant="h1" className="title">
          Create A New Account
        </FormTitle>
        {err?.passwordConfirmation && (
          <Alert severity="error" sx={{ marginBottom: "1rem" }}>
            <AlertTitle>Error</AlertTitle>
            {err.passwordConfirmation}
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
            type="phone"
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
