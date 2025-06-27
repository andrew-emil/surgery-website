/* eslint-disable react/prop-types */
import { Box, Card, CardContent, Typography } from "@mui/material";

const Requirements = ({ requirements }) => {
	return (
		<Box sx={{ width: "100%" }}>
			{requirements.map((requirement) => (
				<Card key={requirement.procedureId}>
					<CardContent>
						<Typography sx={{ fontWeight: "bold" }} variant="h4">
							{requirement.procedureName}
						</Typography>
						<Typography variant="h5">{`Category: ${requirement.category}`}</Typography>
						<Typography variant="h5">{`completed: ${requirement.completed}/${requirement.required}`}</Typography>
					</CardContent>
				</Card>
			))}
		</Box>
	);
};

export default Requirements;
