import SuccessRateChart from "../admin/components/SuccesRateChart";
import ComplicationChart from "../admin/components/ComplicationsChart";
import DataCountCard from "../admin/components/DataCountCards";


const TestPage = () => {
	return (
		<>
			<DataCountCard />
			<SuccessRateChart />
			<ComplicationChart />
		</>
	);
};

export default TestPage;
