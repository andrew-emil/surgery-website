// eslint-disable-next-line no-unused-vars
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";
// import axiosClient from "../axiosClient";
// import { useEffect } from "react";
import { Box, Container } from "@mui/material";
import MiniDrawer from "../components/Drawer";

export default function DefaultLayout() {
  // eslint-disable-next-line no-unused-vars
  const { user, token, setUser, setToken } = useStateContext();
  if (!token) {
    return <Navigate to="/login" />;
  }

  // useEffect(() => {
  //   axiosClient.get("/user").then(({ data }) => {
  //     setUser(data);
  //   });
  // }, []);
  return (
    <Box id="defaultLayout" sx={{ display: "block" }}>
      <div className="content">
        <header>
          <MiniDrawer></MiniDrawer>
          <Container sx={{ mt: 10, pl: { sm: 10, xs: 6 }, pr: { xs: 0 } }}>
            <Outlet />
          </Container>
        </header>
      </div>
    </Box>
  );
}
