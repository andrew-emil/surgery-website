import { Container, Skeleton, AlertTitle, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../axiosClient";

function SurgeryDetails() {
	const location = useLocation();
	const { surgeryId } = location.state;
	const [surgery, setSurgery] = useState(null);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState(null);

	useEffect(() => {
		const fetchSurgeryData = async () => {
			try {
				const response = await axiosClient.get(
					`/surgery/get-surgrey/${surgeryId}`,
					{ withCredentials: true }
				);

				const { data } = response;
				setSurgery(data);
			} catch (err) {
				console.log(err);
				setErr(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchSurgeryData();
	}, [surgeryId]);

	if (loading) {
		return (
			<Container>
				<Skeleton variant="rectangular" height={500} sx={{ marginY: "1rem" }} />
			</Container>
		);
	}

	if (err) {
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
				{err && (
					<Alert
						severity="error"
						sx={{
							marginBottom: "1rem",
							width: 150,
						}}>
						<AlertTitle>Error</AlertTitle>
						{err}
					</Alert>
				)}
			</Container>
		);
	}

	return <Container>{surgeryId}</Container>;
}

export default SurgeryDetails;
