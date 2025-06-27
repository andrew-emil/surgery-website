import {
	Alert,
	AlertTitle,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography
} from "@mui/material";
import { useLoaderData, useParams } from "react-router";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { FormContainer } from "../../components/StyledComponents";
import { useStateContext } from "../../context/contextprovider";

export default function RequestPage() {
	const { id } = useParams();
	const query = new URLSearchParams(window.location.search);
	const consultantId = query.get("consultantId");
	const { user } = useStateContext();
	const rolesData = useLoaderData();
	const actionData = useActionData();
	const navigation = useNavigation();

	return (
		<FormContainer
			maxWidth="sm"
			sx={{ paddingY: { xs: 2, sm: 4 }, minHeight: "80vh" }}>
			<Paper
				elevation={3}
				sx={{
					padding: { xs: 2, sm: 4 },
					borderRadius: 3,
					boxShadow: 4,
					width: "100%",
				}}>
				{actionData?.error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						<AlertTitle>Error</AlertTitle>
						{actionData.error}
					</Alert>
				)}
				<Typography
					variant="h5"
					mb={3}
					sx={{ fontWeight: 600, textAlign: "center" }}>
					Surgery Request Form
				</Typography>

				<Form
					method="post"
					style={{ display: "flex", flexDirection: "column", gap: 24 }}>
					<input type="hidden" name="surgeryId" value={id} />
					<input type="hidden" name="traineeId" value={user.id} />
					<input type="hidden" name="consultantId" value={consultantId} />

					<FormControl fullWidth required>
						<InputLabel id="role-select-label">Role</InputLabel>
						<Select
							labelId="role-select-label"
							name="roleId"
							label="Role"
							defaultValue=""
							required>
							{rolesData.map((role) => (
								<MenuItem key={role.id} value={role.id}>
									{role.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						label="Notes"
						name="notes"
						multiline
						minRows={3}
						fullWidth
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						size="large"
						disabled={navigation.state === "submitting"}
						loading={navigation.state === "submitting"}>
						Submit Request
					</Button>
				</Form>
			</Paper>
		</FormContainer>
	);
}
