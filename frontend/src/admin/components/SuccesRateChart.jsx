import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axiosClient from "../../axiosClient";
import { Container, Skeleton, Typography } from "@mui/material";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const SuccessRateChart = () => {
	const [chartData, setChartData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchChartData = async () => {
			try {
				const response = await axiosClient.get(
					"/admin/dashboard/success-rates",
					{
						withCredentials: true,
					}
				);
				const { data } = response;
				if (data.success) {
					const labels = data.data.map((item) => item.date);
					const successRates = data.data.map((item) => item.successRate);
					setChartData({
						labels,
						datasets: [
							{
								label: "Success Rate (%)",
								data: successRates,
								fill: false,
								borderColor: "rgb(75, 192, 192)",
								tension: 0.1,
							},
						],
					});
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchChartData();
	}, []);

	if (loading) {
		return (
			<Container>
				<Skeleton variant="rectangular" height={500} sx={{ marginY: "1rem" }} />
			</Container>
		);
	}

	return (
		<Container>
			<Typography variant="h4">Surgery Success Rates Over Time</Typography>
			<Line data={chartData} />
		</Container>
	);
};

export default SuccessRateChart;
