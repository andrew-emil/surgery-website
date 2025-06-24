import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Container } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

function App() {
	return (
		<Container sx={{ display: "block", bgcolor: "primary.main" }}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</Container>
	);
}

export default App;
