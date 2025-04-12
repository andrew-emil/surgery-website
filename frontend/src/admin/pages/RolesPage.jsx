import { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Container,
	Skeleton,
	Box,
	IconButton,
	Typography,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axiosClient from "../../axiosClient";

const RolesPage = () => {
	const [loading, setLoading] = useState(true);
	const [roles, setRoles] = useState([]);
	const [err, setErr] = useState(null);

	// Simulate data fetching
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosClient.get("roles", {
					withCredentials: true,
				});
                const {data} = response
				setTimeout(() => {
					setRoles(data.roles);
					setLoading(false);
				}, 1500);
			} catch (err) {
				setErr(err.response.data.message);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Empty handler functions
	const handleAddRole = () => console.log("Add role clicked");
	const handleEditRole = (roleId) => console.log("Edit role:", roleId);
	const handleDeleteRole = (roleId) => console.log("Delete role:", roleId);

	if (loading) {
		return (
			<Container>
				{Array(5)
					.fill(0)
					.map((_, index) => (
						<TableRow key={index}>
							<TableCell>
								<Skeleton variant="text" />
							</TableCell>
							<TableCell>
								<Skeleton variant="text" />
							</TableCell>
							<TableCell>
								<Skeleton variant="text" />
							</TableCell>
							<TableCell>
								<Skeleton variant="text" width="60%" />
								<Skeleton variant="text" width="40%" />
							</TableCell>
							<TableCell>
								<Skeleton variant="circular" width={40} height={40} />
								<Skeleton variant="circular" width={40} height={40} />
							</TableCell>
						</TableRow>
					))}
			</Container>
		);
	}

	if (err) {
		return (
			<Container
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					display: "flex",
					width: "auto",
				}}>
				{err && (
					<Typography
						variant="h4"
						sx={{
							marginBottom: "1rem",
							color: "red",
						}}>
						{err}
					</Typography>
				)}
			</Container>
		);
	}

	return (
		<Container maxWidth="lg">
			<Box display="flex" justifyContent="space-between" mb={2} mt={4}>
				<Typography variant="h4">Roles Management</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<Add />}
					onClick={handleAddRole}>
					Add Role
				</Button>
			</Box>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Parent</TableCell>
							<TableCell>Requirements</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{roles.map((role) => (
							<TableRow key={role.id}>
								<TableCell>{role.id}</TableCell>
								<TableCell>{role.name}</TableCell>
								<TableCell>{role.parent}</TableCell>
								<TableCell>
									{role.requirements?.map((req) => (
										<div key={req.id}>
											{req.procedure.name} ({req.procedure.category}) -
											Required: {req.requiredCount}
										</div>
									))}
								</TableCell>
								<TableCell>
									<IconButton onClick={() => handleEditRole(role.id)}>
										<Edit color="primary" />
									</IconButton>
									<IconButton onClick={() => handleDeleteRole(role.id)}>
										<Delete color="error" />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
};

export default RolesPage;
