import { Alert, AlertTitle, Avatar, Box } from "@mui/material";
import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import {
	FormButton,
	FormCard,
	FormContainer,
	FormTextField,
	FormTitle,
} from "../components/StyledComponents";
import { convertImage } from "./../utils/convertImage";

export default function CreateEquipments() {
	const [picture, setPicture] = useState(null);
	const actionData = useActionData();

	const navigation = useNavigation();
	const isLoading = navigation.state === "submitting";

	return (
		<FormContainer>
			<FormCard sx={{ width: "400px", padding: "2rem" }}>
				{actionData?.error && (
					<Alert severity="error" sx={{ marginBottom: "1rem" }}>
						<AlertTitle>Error</AlertTitle>
						{actionData.error}
					</Alert>
				)}
				{actionData?.message && (
					<Alert severity="success" sx={{ marginBottom: "1rem" }}>
						<AlertTitle>Success</AlertTitle>
						{actionData.message}
					</Alert>
				)}
				<FormTitle>Create New Equipment</FormTitle>
				<Form method="post" encType="multipart/form-data">
					<FormTextField
						type="text"
						label="Equipment Name"
						variant="outlined"
						fullWidth
						required
						name="name"
					/>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "1rem",
							width: "100%",
						}}>
						<Box sx={{ marginY: "1rem" }}>
							<Avatar
								sx={{ width: 100, height: 100 }}
								src={
									picture
										? URL.createObjectURL(picture)
										: picture?.data
											? convertImage(picture.data)
											: null
								}
							/>
							<input
								id="picture-upload"
								type="file"
								accept="image/*"
								name="photo"
								onChange={(e) => {
									setPicture(e.target.files[0]);
								}}
							/>
						</Box>
					</Box>
					<FormButton
						type="submit"
						variant="contained"
						color="primary"
						loading={isLoading}
						disabled={isLoading}>
						Create Equipment
					</FormButton>
				</Form>
			</FormCard>
		</FormContainer>
	);
}
