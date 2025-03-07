import { useRef, useState } from "react";
import {
  FormContainer,
  FormCard,
  FormTitle,
  FormTextField,
  FormButton,
} from "../components/StyledComponents";
import axiosClient from "../axiosClient";
import { Typography, Alert, AlertTitle } from "@mui/material";
import { Link } from "react-router-dom";

export default function ForgoPassword() {
  const emailRef = useRef();
  const [message, setMessage] = useState();
  const [err, setErr] = useState(null);

  const submit = (ev) => {
    ev.preventDefault();
    const payload = {
      email: emailRef.current.value,
    };
    axiosClient
      .post("/users/forget-password", payload)
      .then(({ data }) => {
        setMessage(data.message);
      })
      .catch((err) => {
        const response = err.response;
        console.log(err);
        if (response) {
          setErr(response.data.message);
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
        {message && (
          <Alert severity="success" sx={{ marginBottom: "1rem" }}>
            <AlertTitle>Success</AlertTitle>
            {message}
          </Alert>
        )}

        <FormTitle className="title">Forgot Password</FormTitle>
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
          <FormButton
            type="submit"
            variant="contained"
            className="btn btn-black btn-block"
          >
            Submit
          </FormButton>
        </form>
        <Typography sx={{ marginTop: "1rem", textAlign: "center" }}>
          Back to <Link to="/login">Login</Link> page
        </Typography>
      </FormCard>
    </FormContainer>
  );
}
