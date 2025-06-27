import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useLoaderData, useNavigate } from "react-router";
import StarRating from "./../components/StarRating";

export default function Home() {
	const userSurgeries = useLoaderData();
	const navigation = useNavigate();

	const statusColors = {
		Completed: "green",
		Ongoing: "yellow",
		Cancelled: "red",
	};

	const handleButtonClick = (surgeryId) => {
		navigation(`/surgeryDetails/${surgeryId}`);
	};

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
				<Container
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						display: "flex",
						width: "auto",
					}}>
					<Card>
						<CardContent>
							<Typography
								variant="h4"
								sx={{
									marginBottom: "1rem",
								}}>
								There is no surgeries yet!
							</Typography>
						</CardContent>
					</Card>
				</Container>
			)}
		</Container>
	);
}
