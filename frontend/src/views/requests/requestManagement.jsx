import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import { useLoaderData, useNavigation } from "react-router";
import { FormButton, FormContainer } from "../../components/StyledComponents";

export default function RequestManagement() {
	const userSurgeries = useLoaderData();
	const navigate = useNavigation();

	return (
		<FormContainer
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "95vh",
				gap: 2,
				py: 4,
			}}>
			{userSurgeries.map((surgery, index) => (
				<Card
					key={index}
					sx={{
						width: "100%",
						borderRadius: 3,
						boxShadow: 3,
						padding: 2,
					}}>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							{surgery.name}
						</Typography>
						<Divider sx={{ mb: 2 }} />
						<Box
							display="flex"
							flexWrap="wrap"
							justifyContent="space-between"
							gap={2}>
							<Typography>
								<strong>Date:</strong>{" "}
								{new Date(surgery.date).toLocaleDateString()}
							</Typography>
							<Typography>
								<strong>Time:</strong> {surgery.time}
							</Typography>
							<Typography>
								<strong>Stars:</strong> {surgery.stars}
							</Typography>
							<Typography>
								<strong>ICD Code:</strong> {surgery.icdCode}
							</Typography>
							<Typography>
								<strong>CPT Code:</strong> {surgery.cptCode}
							</Typography>
							<Box sx={{}}>
								<FormButton
									type="button"
									variant="contained"
									className="btn btn-black btn-block"
									onClick={() =>
										navigate(
											`/surgery-requests-management/all-requests/${surgery.id}`
										)
									}>
									Get All Requests
								</FormButton>
							</Box>
						</Box>
					</CardContent>
				</Card>
			))}
		</FormContainer>
	);
}
