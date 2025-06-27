import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/contextprovider"; // Adjust the path as needed

import { Box, Container } from "@mui/material";
import MiniDrawer from "../components/Drawer";
import { useNavigation } from "react-router";
import Loading from "../Loading";

export default function DefaultLayout() {
	const { token } = useStateContext();
	const { state } = useNavigation();

	if (!token) {
		return <Navigate to="/login" />;
	}

	return (
		<Box id="defaultLayout" sx={{ display: "block" }}>
			<div className="content">
				<header>
					<MiniDrawer></MiniDrawer>
					<Container sx={{ mt: 10, pl: { sm: 10, xs: 6 }, pr: { xs: 0 } }}>
						{state === "loading" && <Loading />}
						<Outlet />
					</Container>
				</header>
			</div>
		</Box>
	);
}
