// eslint-disable-next-line no-unused-vars
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";
import { useEffect } from "react";
import axiosClient from "../axiosClient";
import { Box, Container } from "@mui/material";

export default function DefaultLayout() {
  // eslint-disable-next-line no-unused-vars
  const { user, token, setUser, setToken } = useStateContext();
  if (!token) {
    return <Navigate to="/login" />;
  }

  const logout = (ev) => {
    ev.preventDefault();
    axiosClient
      .post("/logout")
      .then(() => {
        setUser(null);
        setToken(null);
      })
      .catch((err) => {
        console.error(err);
        // Handle error appropriately, e.g., show an error message to the user.
      });
  };

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);
  return (
    <Box id="defaultLayout" sx={{ display: "block" }}>
      <div className="content">
        <header>
          <div>Header</div>
          <div>
            {user ? user.name : "adhm"}
            <a href="#" onClick={logout} className="btn-logout">
              Logout
            </a>
          </div>
        </header>
      </div>
      <Container>
        <Outlet />
      </Container>
    </Box>
  );
}
