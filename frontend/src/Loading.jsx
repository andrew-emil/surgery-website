import { Container, Skeleton } from "@mui/material";

export default function Loading() {
	return (
		<Container>
			<Skeleton variant="rectangular" height={205} sx={{ marginY: "1rem" }} />
			<Skeleton variant="rectangular" height={205} sx={{ marginY: "1rem" }} />
			<Skeleton variant="rectangular" height={205} sx={{ marginY: "1rem" }} />
		</Container>
	);
}
