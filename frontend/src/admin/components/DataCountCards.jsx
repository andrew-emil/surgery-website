import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	Typography,
	Grid2,
	Skeleton,
	Box,
} from "@mui/material";
import axiosClient from "../../axiosClient";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";

const DataCountCard = () => {
	const [dataCount, setDataCount] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		axiosClient
			.get("admin/dashboard/data-count", { withCredentials: true })
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to fetch data count");
				}
				return response.json();
			})
			.then((data) => {
				setDataCount(data);
			})
			.catch((err) => {
				setError(err.message);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<Card sx={{ minWidth: 275, margin: 2 }}>
				<CardContent>
					<Typography variant="h5" gutterBottom>
						Data Counts
					</Typography>
					<Grid2 container spacing={2}>
						{[1, 2, 3].map((_, index) => (
							<Grid2 item xs={4} key={index}>
								<Skeleton variant="rectangular" width="100%" height={60} />
							</Grid2>
						))}
					</Grid2>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return <Typography color="error">Error: {error}</Typography>;
	}

	return (
		<Card sx={{ minWidth: 275, margin: "2rem" }}>
			<CardContent>
				<Grid2 container spacing={2}>
					<Grid2 item xs={4}>
						<Typography variant="subtitle1" color="text.secondary">
							Doctors
						</Typography>
						<Box display="flex" alignItems="center">
							<LocalHospitalIcon fontSize="large" sx={{ marginRight: 1 }} />
							<Box>
								<Typography variant="h6">{dataCount.doctorsCount}</Typography>
							</Box>
						</Box>
					</Grid2>
					<Grid2 item xs={4}>
						<Box display="flex" alignItems="center">
							<BusinessIcon fontSize="large" sx={{ marginRight: 1 }} />
							<Box>
								<Typography variant="subtitle1" color="text.secondary">
									Affiliations
								</Typography>
								<Typography variant="h6">
									{dataCount.affiliationCount}
								</Typography>
							</Box>
						</Box>
					</Grid2>
					<Grid2 item xs={4}>
						<Box display="flex" alignItems="center">
							<PeopleIcon fontSize="large" sx={{ marginRight: 1 }} />
							<Box>
								<Typography variant="subtitle1" color="text.secondary">
									Consultants
								</Typography>
								<Typography variant="h6">
									{dataCount.consultantCount}
								</Typography>
							</Box>
						</Box>
					</Grid2>
				</Grid2>
			</CardContent>
		</Card>
	);
};

export default DataCountCard;
