import { useRef, useState } from "react";
import { Link } from "react-router-dom";
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

  const { setUser, setToken } = useStateContext();
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
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErr(response.data.errors);
          console.log(err);
        }
      });
  };

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
