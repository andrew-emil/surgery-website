import { Box, CardHeader, Container, Divider } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useLoaderData, useNavigation } from "react-router";
import { FormButton } from "../../components/StyledComponents";

export default function OpenSlotsSurgeries() {
	const openSlots = useLoaderData();
	const navigate = useNavigation();

	return (
		<Container sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			{openSlots.length > 0 ? (
				openSlots.map((surgery) => {
					return (
						<Card
							key={surgery.id}
							sx={{ width: "100%", borderRadius: 3, boxShadow: 3, p: 2 }}>
							<CardHeader
								title={surgery.surgeryName}
								subheader={surgery.hospital}
								slotProps={{
									title: { variant: "h6", fontWeight: 600 },
									subheader: { color: "text.secondary" },
								}}
							/>
							<Divider />
							<CardContent>
								<Box sx={{ display: "flex", justifyContent: "space-between" }}>
									<Box display="flex" flexDirection="column" gap={1}>
										<Typography variant="body1">
											<strong>Available Slot:</strong> {surgery.availableSlot}
										</Typography>
										<Typography variant="body1">
											<strong>Department:</strong> {surgery.department}
										</Typography>
									</Box>
									<Box sx={{ alignSelf: "flex-end" }}>
										<FormButton
											type="button"
											variant="contained"
											className="btn btn-black btn-block"
											onClick={() =>
												navigate(
													`/surgeries-request/${surgery.id}consultantId=${surgery.leadSurgeon}`
												)
											}>
											Request Surgery
										</FormButton>
									</Box>
								</Box>
							</CardContent>
						</Card>
					);
				})
			) : (
				<Typography>No available slots</Typography>
			)}
		</Container>
	);
}
