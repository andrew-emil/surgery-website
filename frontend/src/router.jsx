import { createBrowserRouter } from "react-router-dom";
import Login from "./views/auth/login";
import Register from "./views/auth/register";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import OTP_auth from "./views/auth/OTP_auth";
import Home from "./views/home";
import ForgoPassword from "./views/auth/forgot_password";
import ResetPassword from "./views/auth/reset_password";
import NotFoundPage from "./views/not_found";
import AdminLayout from "./components/adminLayout";
import MyAccount from "./views/auth/myAccount";
import CreateAffiliation from "./admin/pages/CreateAffiliation";
import CreateSurgery from "./views/surgery/createSurgery";
import SurgeryDetails from "./views/surgery/SurgeryDetails";
import Equipments from "./views/equipments/equipmentsPage";
import CreateEquipments from "./views/equipments/createEquipment";
import Surgeries from "./views/surgery/surgeries";
import AdminDashboard from "./admin/pages/AdminDashborad";
import PendingUsers from "./admin/pages/PendingUsers";
import AffiliationPage from "./admin/pages/AffiliationPage";
import EditEquipment from "./views/equipments/editEquipment";
import AffiliationDetails from "./admin/pages/AffiliationDetails";
import EditSurgery from "./views/surgery/editSurgery";
import AddDepartment from "./admin/pages/AddDepartments";
import EditDepartment from "./admin/pages/editDepartment";
import EditAffiliation from "./admin/pages/EditAffiliation";
import RolesPage from "./admin/pages/RolesPage";
import AddRole from "./admin/pages/AddRole";
import EditRole from "./admin/pages/EditRole";
import UsersPage from "./admin/pages/UsersPage";
import PostSurgery from "./views/postSurgery";
import RoleAssignmentPage from "./views/RoleAssignment";
import RoleManagmentPage from "./views/RoleManagmentPage";
import RequestPage from "./views/requests/requestPage";

import SurgicalRolePage from "./views/SurgicalRoles";
import AddSurgicalRole from "./views/AddSurgicalRole";
import EditSurgicalRole from "./views/EditSurgicalRole";
import ProcedureTypePage from "./views/ProcedureTypes";
import AddProcedureType from "./views/AddProcedureType";
import EditProcedureType from "./views/EditProcedureType";
import RequestManagement from "./views/requests/requestManagement";
import RequestsForSurgery from "./views/requests/requestsForSurgery";
import NotificationPage from "./views/NotificationPage";
import AuditTrailTable from "./admin/pages/AuditTrailTable";
import ReportsPanel from "./admin/pages/ReportPanel";
import OpenSlotsSurgeries from "./views/surgery/OpenSlotsSurgeries";

import Error from "./Error";

//loaders
import { homeLoader } from "./loaders/homeLoader";
import { loader as surgeryDetailsLoader } from "./loaders/surgeryDetailsLoader";
import { accountLoader } from "./loaders/accountLoader";
import { openSlotsLoader } from "./loaders/openSlotsLoader";
import { requestPageLoader } from "./loaders/requestPageLoader";
import { requestManagementLoader } from "./loaders/requestManagementLoader";
import { registerLoader } from "./loaders/registerLoader";

//actions
import { myAccountAction } from "./actions/myAccountAction";
import { createEquipmentAction } from "./actions/createEquipmentAction";
import { requestPageAction } from "./actions/requestPageAction";
import { requestsForSurgeryLoader } from "./loaders/requestsForSurgeryLoader";
import { loginAction } from "./actions/loginAction";
import { registerAction } from "./actions/registerAction";

const router = createBrowserRouter([
	{
		path: "/",
		element: <DefaultLayout />,
		errorElement: <Error />,
		children: [
			{
				path: "/",
				element: <Home />,
				loader: homeLoader,
				index: true,
			},
			{
				path: "/surgeryDetails/:surgeryId",
				element: <SurgeryDetails />,
				loader: surgeryDetailsLoader,
			},
			{
				path: "/account",
				element: <MyAccount />,
				loader: accountLoader,
				action: myAccountAction,
			},
			{
				path: "/add-equipment",
				element: <CreateEquipments />,
				action: createEquipmentAction,
			},

			//TODO: adjust these also
			{ path: "/create_surgery", element: <CreateSurgery /> },
			{ path: "/equipments", element: <Equipments /> },
			{ path: "/surgeries", element: <Surgeries /> },
			{ path: "/post-surgery", element: <PostSurgery /> },

			{
				path: "/surgeries-open-slots",
				element: <OpenSlotsSurgeries />,
				loader: openSlotsLoader,
			},
			{
				path: "/surgeries-request/:id",
				element: <RequestPage />,
				loader: requestPageLoader,
				action: requestPageAction,
			},

			{
				path: "/surgery-requests-management",
				element: <RequestManagement />,
				loader: requestManagementLoader,
			},
			{
				path: "/surgery-requests-management/all-requests/:surgeryId",
				element: <RequestsForSurgery />,
				loader: requestsForSurgeryLoader,
			},
			{ path: "/notifications", element: <NotificationPage /> },
			//TODO: adjust this also
			{ path: "/edit-surgery", element: <EditSurgery /> },

			//TODO: adjust these also
			{ path: "/edit-equipment/:id", element: <EditEquipment /> },
			{ path: "/role-assign/:roleId", element: <RoleAssignmentPage /> },
			{ path: "/consultant/roles", element: <RoleManagmentPage /> },

			{ path: "/surgical-roles", element: <SurgicalRolePage /> },
			{ path: "/surgical-roles/add", element: <AddSurgicalRole /> },
			{ path: "/surgical-roles/edit", element: <EditSurgicalRole /> },

			{ path: "/procedure-types", element: <ProcedureTypePage /> },
			{ path: "/procedure-types/add", element: <AddProcedureType /> },
			{ path: "/procedure-types/edit", element: <EditProcedureType /> },

			{ path: "*", element: <NotFoundPage /> },
		],
	},
	{
		path: "/",
		element: <GuestLayout />,
		children: [
			{ path: "/login", element: <Login />, action: loginAction },
			{
				path: "/register",
				element: <Register />,
				loader: registerLoader,
				action: registerAction,
			},
			{ path: "/forgot-password", element: <ForgoPassword /> },
			{ path: "/reset-password", element: <ResetPassword /> },
			{ path: "/otp", element: <OTP_auth /> },
			{ path: "*", element: <NotFoundPage /> },
		],
	},
	{
		//TODO: admin
		path: "/",
		element: <AdminLayout />,
		children: [
			{ path: "/admin", element: <AdminDashboard /> },
			{ path: "/admin/dashboard", element: <AdminDashboard /> },
			{ path: "/admin/pending-users", element: <PendingUsers /> },
			{ path: "/admin/affiliations", element: <AffiliationPage /> },
			{ path: "/admin/create-affiliation", element: <CreateAffiliation /> },
			{ path: "/admin/affiliation-details", element: <AffiliationDetails /> },
			{ path: "/admin/affiliations/edit", element: <EditAffiliation /> },
			{ path: "/admin/add-department", element: <AddDepartment /> },
			{ path: "/admin/edit-department", element: <EditDepartment /> },
			{ path: "/admin/users", element: <UsersPage /> },

			{ path: "/admin/roles", element: <RolesPage /> },

			{ path: "/admin/roles/add-role", element: <AddRole /> },
			{ path: "/admin/roles/edit", element: <EditRole /> },

			{ path: "/admin/audit", element: <AuditTrailTable /> },
			{ path: "/admin/report", element: <ReportsPanel /> },
		],
	},
]);

export default router;
