import { Container, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";

export default function Error() {
	const error = useRouteError();

	return (
		<Container
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				display: "flex",
				width: "auto",
			}}>
			<Typography
				variant="h4"
				sx={{
					marginBottom: "1rem",
					color: "red",
				}}>
				{error.data || error.message || "Unknown error"}
			</Typography>
		</Container>
	);
}
