import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container, Skeleton, Alert, AlertTitle } from "@mui/material";
import axiosClient from "./../axiosClient";
import StarRating from "./../components/StarRating";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [userSurgeries, setUserSurgeries] = useState([]);
	const [err, setErr] = useState(null);
	const navigate = useNavigate();

	const statusColors = {
		Completed: "green",
		Ongoing: "yellow",
		Cancelled: "red",
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosClient.get("/surgery/surgeries", {
					withCredentials: true,
				});
				const { data } = response;
				setUserSurgeries(data.surgeries);
			} catch (err) {
				console.log(err);
				setErr(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleButtonClick = (surgeryId) => {
		console.log(surgeryId);
		navigate("/surgeryDetails", {
			state: {
				surgeryId,
			},
		});
	};

	if (loading) {
		return (
			<Container>
				<Skeleton variant="rectangular" height={205} sx={{ marginY: "1rem" }} />
				<Skeleton variant="rectangular" height={205} sx={{ marginY: "1rem" }} />
				<Skeleton variant="rectangular" height={205} sx={{ marginY: "1rem" }} />
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

	return (
		<Container>
			{userSurgeries.length > 0 ? (
				userSurgeries.map((surgery) => (
					<Card variant="outlined" key={surgery.id} sx={{ marginY: "1rem" }}>
						<>
							<CardContent>
								<Typography
									gutterBottom
									sx={{ color: statusColors[surgery.status], fontSize: 14 }}>
									{surgery.status}
								</Typography>
								<Typography variant="h5" component="div">
									{surgery.name}
								</Typography>

								<StarRating rating={surgery.stars} />

								<Typography variant="body2">
									{`date/time: ${surgery.date.split("T")[0]} / ${surgery.time}`}
									<br />
									{`CPT/ICD: ${surgery.cptCode}/${surgery.icdCode}`}
								</Typography>
							</CardContent>
							<CardActions>
								<Button
									size="small"
									onClick={() => handleButtonClick(surgery.id)}>
									see more details
								</Button>
							</CardActions>
						</>
					</Card>
				))
			) : (
				<Typography
					variant="h5"
					component="div"
					sx={{
						color: "red",
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						display: "flex",
						width: "auto",
					}}>
					No surgeries found!
				</Typography>
			)}
			
		</Container>
	);
}
