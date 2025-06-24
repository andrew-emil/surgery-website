import { useState } from "react";
import {
	Container,
	Skeleton,
	Paper,
	Typography,
	Grid2,
	List,
	ListItem,
	ListItemText,
	Divider,
	Chip,
	Box,
	Stack,
	Avatar,
	Tooltip,
} from "@mui/material";
import { useLoaderData, useNavigation } from "react-router-dom";
import {
	CheckCircle,
	Person,
	MedicalInformation,
	AccessTime,
	MonitorHeart,
	MedicalServices,
} from "@mui/icons-material";
import { useStateContext } from "../context/contextprovider";
import { convertImage } from "./../utils/convertImage";
import RatingsSection from './../../components/surgery/RatingSection';

const SurgeryDetails = () => {
	const navigation = useNavigation();
	const surgeryData = useLoaderData();
	const { user } = useStateContext();
	const [ratings, setRatings] = useState(surgeryData.ratings);

	const updateRatingsState = (updatedBreakdown) => {
		const totalStars = updatedBreakdown.reduce((sum, r) => sum + r.stars, 0);
		const count = updatedBreakdown.length;
		const average = count > 0 ? totalStars / count : 0;
		setRatings({
			...ratings,
			breakdown: updatedBreakdown,
			average,
			count,
		});
	};

	if (navigation.state === "loading") {
		return (
			<Container>
				<Skeleton variant="rectangular" height={500} sx={{ marginY: "1rem" }} />
			</Container>
		);
	}

	return (
		<Container>
			<Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
				<Typography variant="h5" gutterBottom>
					{surgeryData.metadata.name}
					<Chip
						icon={<CheckCircle />}
						label={surgeryData.timeline.status}
						color="success"
						sx={{ ml: 2 }}
					/>
				</Typography>
				{/* Metadata Section */}
				<Box mb={3}>
					<Grid2 container spacing={3}>
						<Grid2 item md={6}>
							<Typography variant="subtitle1" gutterBottom>
								<strong>Hospital:</strong> {surgeryData.metadata.hospital}
							</Typography>
							<Typography variant="subtitle1" gutterBottom>
								<strong>Department:</strong> {surgeryData.metadata.department}
							</Typography>
							<Typography variant="subtitle1" gutterBottom>
								<strong>Lead Surgeon:</strong> Dr.{" "}
								{surgeryData.metadata.leadSurgeon}
							</Typography>
						</Grid2>
						<Grid2 item md={6}>
							<Typography variant="subtitle1" gutterBottom>
								<strong>Equipment:</strong>
							</Typography>
							<Stack direction="row" spacing={1}>
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
									{surgeryData.metadata.surgeryEquipments.map((equipment) => (
										<Tooltip
											key={equipment.id}
											title={equipment.equipment_name}
											arrow>
											<Chip
												sx={{
													height: 60,
													borderRadius: 1,
													borderColor: "divider",
													"& .MuiChip-avatar": {
														width: 48,
														height: 48,
														bgcolor: "primary.light",
													},
												}}
												avatar={
													<Avatar
														src={
															equipment.photo?.data
																? convertImage(equipment.photo.data)
																: null
														}>
														<MedicalServices />
													</Avatar>
												}
												label={
													<Box
														sx={{
															maxWidth: 120,
															whiteSpace: "nowrap",
															overflow: "hidden",
															textOverflow: "ellipsis",
														}}>
														{equipment.equipment_name}
													</Box>
												}
												variant="outlined"
											/>
										</Tooltip>
									))}
								</Box>
							</Stack>
						</Grid2>
					</Grid2>
				</Box>
				<Divider sx={{ my: 2 }} />
				{/* Timeline */}
				<Box mb={3}>
					<Typography variant="h6" gutterBottom>
						<AccessTime sx={{ verticalAlign: "middle", mr: 1 }} />
						Schedule
					</Typography>
					<Grid2 container spacing={3}>
						<Grid2 item xs={4}>
							<Typography>
								<strong>Date:</strong> {surgeryData.timeline.date.split("T")[0]}
							</Typography>
						</Grid2>
						<Grid2 item xs={4}>
							<Typography>
								<strong>Time:</strong> {surgeryData.timeline.time}
							</Typography>
						</Grid2>
						<Grid2 item xs={4}>
							<Typography>
								<strong>Duration:</strong>{" "}
								{surgeryData.outcomes?.duration || "-"} mins
							</Typography>
						</Grid2>
					</Grid2>
				</Box>
				<Divider sx={{ my: 2 }} />
				{/* Medical Codes */}
				<Box mb={3}>
					<Typography variant="h6" gutterBottom>
						<MedicalInformation sx={{ verticalAlign: "middle", mr: 1 }} />
						Medical Codes
					</Typography>
					<Grid2 container spacing={3}>
						<Grid2 item xs={6}>
							<Typography>
								<strong>CPT:</strong> {surgeryData.medicalCodes.cpt}
							</Typography>
						</Grid2>
						<Grid2 item xs={6}>
							<Typography>
								<strong>ICD:</strong> {surgeryData.medicalCodes.icd}
							</Typography>
						</Grid2>
					</Grid2>
				</Box>
				<Divider sx={{ my: 2 }} />
				{/* Team Section */}
				<Box mb={3}>
					<Typography variant="h6" gutterBottom>
						<Person sx={{ verticalAlign: "middle", mr: 1 }} />
						Surgical Team
					</Typography>
					<List dense>
						{surgeryData.team.map((member) => (
							<ListItem key={member.id}>
								<ListItemText
									primary={member.name}
									secondary={member.surgicalRole}
								/>
							</ListItem>
						))}
					</List>
				</Box>
				<Divider sx={{ my: 2 }} />
				{/* Patient Outcomes */}
				<Box mb={3}>
					<Typography variant="h6" gutterBottom>
						<MonitorHeart sx={{ verticalAlign: "middle", mr: 1 }} />
						Patient & Outcomes
					</Typography>
					<Grid2 container spacing={3}>
						<Grid2 item xs={4}>
							<Typography>
								<strong>BMI:</strong> {surgeryData.patient.bmi}
							</Typography>
							<Typography>
								<strong>Comorbidity:</strong>{" "}
								{surgeryData.patient.comorbidity.join(", ")}
							</Typography>
						</Grid2>
						<Grid2 item xs={4}>
							<Typography>
								<strong>Diagnosis:</strong> {surgeryData.patient.diagnosis}
							</Typography>
						</Grid2>
						<Grid2 item xs={4}>
							<Typography>
								<strong>Discharge Status:</strong>{" "}
								{surgeryData.outcomes?.dischargeStatus.replace("_", " ") || "-"}
							</Typography>
							<Typography>
								<strong>Result:</strong> {surgeryData.outcomes?.result || "-"}
							</Typography>
						</Grid2>
					</Grid2>
				</Box>
				<Divider sx={{ my: 2 }} />
				{/* Ratings & Reviews */}
				<RatingsSection
					surgeryData={{ ...surgeryData, ratings }}
					user={user}
					updateRatingsState={updateRatingsState}
				/>
			</Paper>
		</Container>
	);
};

export default SurgeryDetails;


