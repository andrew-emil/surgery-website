import { createBrowserRouter } from "react-router-dom";
import Login from "./views/login";
import Register from "./views/register";
import Users from "./views/users";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import OTP_auth from "./views/OTP_auth";
import Home from "./views/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { path: "/users", element: <Users /> },
      { path: "/", element: <Home /> },
      { path: "/home", element: <Home /> },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/otp", element: <OTP_auth /> },
    ],
  },
]);

export default router;
