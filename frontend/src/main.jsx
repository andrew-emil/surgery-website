import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ContextProvider } from "./context/contextprovider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3674B5",
    },
    secondary: {
      main: "#f2f2f2",
    },
    text: {
      main: "#212121",
      secondary: "#757575",
    },
    background: {
      default: "#f1f1f1",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider
      theme={theme}
      sx={{ height: "100%", bgColor: "secondary.main" }}
    >
      <CssBaseline />
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </ThemeProvider>
  </StrictMode>
);
