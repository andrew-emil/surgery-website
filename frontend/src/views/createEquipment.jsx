import { useRef, useState } from "react";
import {
  FormContainer,
  FormCard,
  FormButton,
  FormTextField,
  FormTitle,
} from "../components/StyledComponents";
import { Alert, AlertTitle, Box, InputLabel } from "@mui/material";
import axiosClient from "../axiosClient";

export default function CreateEquipments() {
  const nameRef = useRef();
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [picture, setPicture] = useState(null);

  const submit = async (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    setErr(null);
    const formData = new FormData();
    formData.append("name", nameRef.current.value);

    if (picture) {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(picture);
      });

      formData.append("photo", picture);
    }

    axiosClient
      .post("/surgery-equipments", formData, { withCredentials: true })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        const response = err.response;
        console.log(err);
        if (response) {
          setErr(response.data.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <FormContainer>
      <FormCard sx={{ width: "400px", padding: "2rem" }}>
        {err && (
          <Alert severity="error" sx={{ marginBottom: "1rem" }}>
            <AlertTitle>Error</AlertTitle>
            {err}
          </Alert>
        )}
        <FormTitle>Create New Equipment</FormTitle>
        <form onSubmit={submit}>
          <FormTextField
            inputRef={nameRef}
            type="text"
            label="Equipment Name"
            variant="outlined"
            fullWidth
            required
          />
          <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <InputLabel shrink htmlFor="picture-upload">
              Upload Picture
            </InputLabel>
            <input
              id="picture-upload"
              type="file"
              accept="image/*"
              required
              onChange={(e) => setPicture(e.target.files[0])}
            />
          </Box>
          <FormButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isLoading}
          >
            Create Equipment
          </FormButton>
        </form>
      </FormCard>
    </FormContainer>
  );
}
