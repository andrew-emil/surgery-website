import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { useStateContext } from "../context/contextprovider";

export default function Home() {
	const { user } = useStateContext();
	console.log(user);
	return (
		<Container>
			<Card variant="outlined">
				<>
					<CardContent>
						<Typography
							gutterBottom
							sx={{ color: "text.secondary", fontSize: 14 }}>
							Word of the Day
						</Typography>
						<Typography variant="h5" component="div">
							Heart Surgery
						</Typography>
						<Typography sx={{ color: "text.secondary", mb: 1.5 }}>
							adjective
						</Typography>
						<Typography variant="body2">
							well meaning and kindly.
							<br />
							{'"a benevolent smile"'}
						</Typography>
					</CardContent>
					<CardActions>
						<Button size="small">Learn More</Button>
					</CardActions>
				</>
			</Card>
		</Container>
	);
}
