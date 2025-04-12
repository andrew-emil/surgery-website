import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	Typography,
	Skeleton,
	Box,
	Container,
	Grid2,
	AlertTitle,
	Alert,
	Button,
} from "@mui/material";
import axiosClient from "../../axiosClient";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router";

const DataCountCard = () => {
	const [dataCount, setDataCount] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate()

	useEffect(() => {
		axiosClient
			.get("admin/dashboard/data-count", { withCredentials: true })
			.then(({ data }) => {
				setDataCount(data);
			})
			.catch((err) => {
				setError(err.message);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<Container
				sx={{
					marginY: "2rem",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Grid2 container spacing={2}>
					{[1, 2, 3].map((_, index) => (
						<Grid2 item sx={{ width: "15rem" }} key={index}>
							<Skeleton variant="rectangular" width="100%" height={140} />
						</Grid2>
					))}
				</Grid2>
			</Container>
		);
	}

	if (error) {
		return (
			<Container
				sx={{
					marginY: "2rem",
					display: "flex",
					justifyContent: "flex-start",
					alignItems: "center",
				}}>
				<Alert severity="error" sx={{ marginY: "1rem", width: "20rem" }}>
					<AlertTitle>Error</AlertTitle>
					{error}
				</Alert>
			</Container>
		);
	}

	const handleButtonClick = (index) => {
		if(index === 1){
			navigate("/admin/affiliations")
		}
	}

	const cardData = [
		{
			title: "Doctors",
			count: dataCount.doctorsCount,
			icon: <LocalHospitalIcon fontSize="large" sx={{ marginRight: 1 }} />,
		},
		{
			title: "Affiliations",
			count: dataCount.affiliationCount,
			icon: <BusinessIcon fontSize="large" sx={{ marginRight: 1 }} />,
		},
		{
			title: "Consultants",
			count: dataCount.consultantCount,
			icon: <PeopleIcon fontSize="large" sx={{ marginRight: 1 }} />,
		},
	];

	return (
		<Container
			sx={{
				marginY: "2rem",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}>
			<Grid2 container spacing={2}>
				{cardData.map((card, index) => (
					<Grid2 item sx={{ width: "15rem" }} key={index}>
						<Card
							sx={{
								minHeight: 150,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}>
							<Button fullWidth sx={{ color: "inherit", minHeight: 150 }} onClick={() => handleButtonClick(index)}>
								<CardContent>
									<Box
										display="flex"
										flexDirection="column"
										alignItems="center">
										{card.icon}
										<Typography
											variant="subtitle1"
											color="text.secondary"
											sx={{ marginTop: 1 }}>
											{card.title}
										</Typography>
										<Typography
											variant="h4"
											sx={{ fontWeight: "bold", marginTop: 1 }}>
											{card.count}
										</Typography>
									</Box>
								</CardContent>
							</Button>
						</Card>
					</Grid2>
				))}
			</Grid2>
		</Container>
	);
};

export default DataCountCard;
