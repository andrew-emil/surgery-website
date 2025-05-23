import { useRef, useState } from "react";
import {
	FormCard,
	FormContainer,
	FormTextField,
	FormButton,
	FormTitle,
} from "../components/StyledComponents";
import {
	Alert,
	AlertTitle,
	MenuItem,
	InputLabel,
	Select,
	FormControl,
} from "@mui/material";
import axiosClient from "../axiosClient";

const category = {
	PS: "supervised",
	AS: "assistance",
	PI: "independent",
	O: "observation",
};

const AddProcedureType = () => {
	const nameRef = useRef();
	const [err, setErr] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [msg, setMsg] = useState(null);
	const [selectedType, setSelectedType] = useState(Object.values(category)[0]);

	const handleChange = (event) => {
		setSelectedType(event.target.value);
	};

	const submit = async (ev) => {
		ev.preventDefault();
		setIsLoading(true);
		setErr(null);
		setMsg(null);
		const payload = {
			name: nameRef.current.value,
			category: selectedType,
		};

		try {
			const response = await axiosClient.post("/procedure-types", payload, {
				withCredentials: true,
			});

			const { data } = response;
			setMsg(data.message);
		} catch (err) {
			console.error(err);
			setErr(err.response.data.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<FormContainer>
			<FormCard>
				{err && (
					<Alert severity="error" sx={{ marginBottom: "1rem" }}>
						<AlertTitle>Error</AlertTitle>
						{err}
					</Alert>
				)}
				{msg && (
					<Alert severity="success" sx={{ marginBottom: "1rem" }}>
						<AlertTitle>Success</AlertTitle>
						{msg}
					</Alert>
				)}
				<FormTitle>Add Procedure Type</FormTitle>
				<form onSubmit={submit}>
					<FormTextField
						inputRef={nameRef}
						type="text"
						label="Procedure Name"
						variant="outlined"
						fullWidth
						required
					/>
					<FormControl fullWidth sx={{ marginBottom: "1rem" }}>
						<InputLabel id="institution-type-label">
							Procedure Category
						</InputLabel>
						<Select
							labelId="institution-type-label"
							id="institution-type"
							value={selectedType}
							label="Procedure Category"
							onChange={handleChange}
							required>
							{Object.values(category).map((type) => (
								<MenuItem key={type} value={type}>
									{type}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormButton
						type="submit"
						variant="contained"
						color="primary"
						loading={isLoading}>
						Add Procedure Type
					</FormButton>
				</form>
			</FormCard>
		</FormContainer>
	);
};

export default AddProcedureType;
