import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../axiosClient";
import {
  FormButton,
  FormContainer,
  FormTextField,
} from "../components/StyledComponents";
import { Alert, AlertTitle } from "@mui/material";

export default function EditSurgery() {
  const query = new URLSearchParams(useLocation().search);
  const id = parseInt(query.get("id"));

  const [surgery, setSurgery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [redirect, setRedirect] = useState(null);

  const nameRef = useRef();

  console.log(id);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/surgery/${id}`, { withCredentials: true })
      .then((res) => {
        const data = res.data;
        setSurgery(data);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        setError(error?.response?.data?.message);
        setLoading(false);
      });
  }, [id]);

  const submit = async (ev) => {
    ev.preventDefault();
    // setLoading(true);
    // setError(null);

    // const formData = new FormData();
    // formData.append("name", nameRef.current.value);

    // if (picture instanceof File) {
    //   const base64Image = await new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.onload = () => resolve(reader.result);
    //     reader.onerror = (error) => reject(error);
    //     reader.readAsDataURL(picture);
    //   });

    //   formData.append("photo", base64Image);
    // }

    // axiosClient
    //   .put(`/surgery-equipments/${id}`, formData, { withCredentials: true })
    //   .then(({ data }) => {
    //     setMsg(data.message);
    //   })
    //   .catch((err) => {
    //     const response = err.response;
    //     if (response) {
    //       setError(response.data.message);
    //     }
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //     setRedirect(true);
    //   });
  };
  if (redirect) {
    setTimeout(() => {
      window.location.href = "/surgeries";
    }, 2000); // Redirect after 2 seconds
  }
  return (
    <FormContainer
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ marginBottom: "1rem" }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      {msg && (
        <Alert severity="success" sx={{ marginBottom: "1rem" }}>
          <AlertTitle>Success</AlertTitle>
          {msg}
        </Alert>
      )}
      <form onSubmit={submit} style={{ width: "100%" }}>
        <FormTextField
          sx={{ width: "100%" }}
          inputRef={nameRef}
          type="text"
          label="Equipment Name"
          variant="outlined"
          placeholder={surgery?.name}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <FormButton
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
        >
          Save Equipment
        </FormButton>
      </form>
    </FormContainer>
  );
}
