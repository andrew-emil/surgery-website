import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Container, Skeleton, Typography } from "@mui/material";
import axiosClient from "../../axiosClient";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const ComplicationChart = () => {
	const [chartData, setChartData] = useState(null);
	const [loading, setLoading] = useState(true);

	const getRandomColor = () => {
		const letters = "0123456789ABCDEF";
		let color = "#";
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	};

	useEffect(() => {
		const fetchChartData = async () => {
			try {
				const response = await axiosClient.get(
					"/admin/dashboard/complication-trends",
					{
						withCredentials: true,
					}
				);
				const { data } = response;

				if (data.success) {
					const timeSeries = data.data.timeSeries;
					const dates = [
						...new Set(timeSeries.map((item) => item.date)),
					].sort();
					const complicationTypes = [
						...new Set(timeSeries.map((item) => item.complication)),
					];

					const datasets = complicationTypes.map((complication) => {
						const dataPoints = dates.map((date) => {
							const record = timeSeries.find(
								(item) =>
									item.date === date && item.complication === complication
							);
							return record ? record.count : 0;
						});
						return {
							label: complication,
							data: dataPoints,
							backgroundColor: getRandomColor(),
						};
					});

					setChartData({
						labels: dates,
						datasets: datasets,
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
			<Typography variant="h4">Monthly Complications by Type</Typography>
			<Bar
				data={chartData}
				options={{
					plugins: {
						title: {
							display: true,
							text: "Monthly Complications",
						},
						tooltip: {
							mode: "index",
							intersect: false,
						},
						legend: {
							position: true,
						},
					},
					responsive: true,
					scales: {
						x: {
							stacked: true,
						},
						y: {
							stacked: true,
							beginAtZero: true,
						},
					},
				}}
			/>
		</Container>
	);
};

export default ComplicationChart;
