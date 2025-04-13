import * as React from "react";
import { extendTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import UsersPage from "../admin/pages/UsersPage";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AdminDashboard from "../admin/pages/AdminDashborad";
import PendingUsers from "../admin/pages/PendingUsers";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AffiliationPage from "../admin/pages/AffiliationPage";
import AffiliationDetails from "../admin/pages/AffiliationDetails";
// import router from "../router";
import EditAffiliation from "../admin/pages/EditAffiliation";
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndTwoTone from "@mui/icons-material/AssignmentIndTwoTone";
import RolesPage from './../admin/pages/RolesPage';
import AddRole from "../admin/pages/AddRole";
import EditRole from "../admin/pages/EditRole";

const NAVIGATION = [
	{
		kind: "header",
		title: "Main items",
	},
	{
		segment: "dashboard",
		title: "Dashboard",
		icon: <DashboardIcon />,
	},
	{
		segment: "pending_users",
		title: "Pending Users",
		icon: <PeopleIcon />,
	},
	{
		segment: "affiliation",
		title: "Affiliations",
		icon: <LocalHospitalIcon />,
	},
	{
		segment: "users",
		title: "Users",
		icon: <PersonIcon />,
	},
	{
		segment: "roles",
		title: "Roles",
		icon: <AssignmentIndTwoTone />,
	},
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled("div")(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));
function DemoPageContent({
  pathname,
  navigate,
  selectedAffiliationId,
  setSelectedAffiliationId,
}) {
  let content = null;

  if (pathname === "/dashboard") {
    content = <AdminDashboard />;
  } else if (pathname === "/pending_users") {
    content = <PendingUsers />;
  } else if (pathname === "/affiliation") {
    content = (
      <AffiliationPage
        navigate={navigate}
        selectedAffiliationId={selectedAffiliationId}
        setSelectedAffiliationId={setSelectedAffiliationId}
      />
    );
  } else if (pathname === "/affiliation-details") {
    content = <AffiliationDetails affiliationId={selectedAffiliationId} />;
  } else if (pathname === "/affiliations/edit") {
    content = <EditAffiliation affiliationId={selectedAffiliationId} />;
  } else if(pathname === "/users"){
    content = < UsersPage />
  } else if(pathname === "/roles") {
    content = <RolesPage />
  }
  else {
    content = <Typography>Unknown page</Typography>;
  }

  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {content}
    </Box>
  );
}
export default function Dashboard(props) {
  const { window } = props;
  const [selectedAffiliationId, setSelectedAffiliationId] =
    React.useState(null); // 👈 new state here

  const router = useDemoRouter("/dashboard");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{
        title: "Surgical Web",
        homeUrl: "/dashboard",
      }}
    >
      <DashboardLayout>
        <PageContainer>
          <DemoPageContent
            pathname={router.pathname}
            navigate={router.navigate}
            selectedAffiliationId={selectedAffiliationId}
            setSelectedAffiliationId={setSelectedAffiliationId}
          />{" "}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
