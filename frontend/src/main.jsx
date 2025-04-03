import PropTypes from "prop-types";
import { RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import router from "./router";
// import { Container } from "@mui/material";
import { useStateContext } from "./context/contextprovider";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ContextProvider } from "./context/contextprovider";

const ThemeWrapper = ({ children }) => {
  const { settings } = useStateContext();

  const theme = createTheme({
    palette: {
      mode: settings.theme,
      primary: {
        main: "#3674B5",
      },
      secondary: {
        main: "#f2f2f2",
      },
      text: {
        main: settings.theme === "dark" ? "#ffffff" : "#212121",
        secondary: settings.theme === "dark" ? "#b0b0b0" : "#757575",
      },
      background: {
        default: settings.theme === "dark" ? "#121212" : "#f1f1f1",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

ThemeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//   },
// });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      <ThemeWrapper>
        <RouterProvider router={router} />
      </ThemeWrapper>
    </ContextProvider>
  </StrictMode>
);
