/* eslint-disable no-unused-vars */
import {
  Button,
  Card,
  Container,
  styled,
  TextField,
  Typography,
} from "@mui/material";

export const FormTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  marginBottom: "1rem",
}));

export const FormButton = styled(Button)(({ theme }) => ({
  width: "100%",
}));

export const FormTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",

  marginBottom: ".5rem",
  textAlign: "center",
}));

export const FormCard = styled(Card)(({ theme }) => ({
  width: "360px",
  position: "relative",
  zIndex: 1,
  maxWidth: "360px",
  padding: "34px",
}));

export const FormContainer = styled(Container)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));
