import SuccessRateChart from "../components/SuccesRateChart";
import ComplicationChart from "../components/ComplicationsChart";
import DataCountCard from "../components/DataCountCards";
import { Container } from "@mui/material";

const AdminDashboard = () => {
	return (
		<Container sx={{gap: '1rem'}}>
			<DataCountCard />
			<SuccessRateChart />
			<ComplicationChart />
		</Container>
	);
};

export default AdminDashboard;
