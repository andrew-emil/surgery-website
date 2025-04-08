import { createBrowserRouter } from "react-router-dom";
import Login from "./views/login";
import Register from "./views/register";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import OTP_auth from "./views/OTP_auth";
import Home from "./views/home";
import ForgoPassword from "./views/forgot_password";
import ResetPassword from "./views/reset_password";
import NotFoundPage from "./views/not_found";
import Dashboard from "./views/dashboard";
import AdminLayout from "./components/adminLayout";
import MyAccount from "./views/myAccount";
import CreateSurgery from "./views/createSurgery";
import SurgeryDetails from "./views/SurgeryDetails";
import TestPage from "./views/Test";
import Equipments from "./views/equipments";
import CreateEquipments from "./views/createEquipment";
import Surgeries from "./views/surgeries";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/account", element: <MyAccount /> },
      { path: "/surgeryDetails", element: <SurgeryDetails /> },
      { path: "/create_surgery", element: <CreateSurgery /> },
      { path: "/equipments", element: <Equipments /> },
      { path: "/add-equipment", element: <CreateEquipments /> },
      { path: "/surgeries", element: <Surgeries /> },
      { path: "/test", element: <TestPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgoPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/otp", element: <OTP_auth /> },
      { path: "*", element: <NotFoundPage /> } /* not working */,
    ],
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [{ path: "/admin", element: <Dashboard /> }],
  },
]);

export default router;
