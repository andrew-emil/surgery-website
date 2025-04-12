import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import {
	Container,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Pagination,
	Avatar,
	Skeleton,
	Snackbar,
} from "@mui/material";
import { convertImage } from "../../utils/convertImage";
import { AccountCircle } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		pages: 1,
		total: 1,
	});
	const [loading, setLoading] = useState(true);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [msg, setMsg] = useState(null);
	const [err, setErr] = useState(null);

	useEffect(() => {
		const fetchUsersData = async () => {
			try {
				const page = Number(pagination.currentPage);
				const response = await axiosClient.get(`/admin/users?page=${page}`, {
					withCredentials: true,
				});
				const { data } = response;
				setUsers(data.users);
				setPagination(data.pagination);
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		};

		fetchUsersData();
	}, [pagination.currentPage]);

	const handlePageChange = (e, page) => {
		setPagination((prev) => ({
			...prev,
			currentPage: page,
		}));
	};

	// Handle promote action
	const handlePromote = async (userId) => {
		setButtonLoading(true);
		try {
			const response = await axiosClient.patch(
				`/admin/promote/${userId}`,
				{},
				{ withCredentials: true }
			);

			const { data } = response;
			setMsg(data.message);
			setOpen(true);
		} catch (err) {
			console.log(err);
			setErr(err.response.data.message);
			setOpen(true);
		} finally {
			setButtonLoading(false);
		}
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	// Handle delegate action
	const handleDelegate = (userId) => {
		console.log("Delegate user:", userId);
		// Add your delegate logic here
	};

	const action = (
		<>
			<Button color="secondary" size="small" onClick={handleClose}>
				Close
			</Button>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleClose}>
				<CloseIcon fontSize="small" />
			</IconButton>
		</>
	);

	if (loading) {
		return (
			<Container sx={{ marginY: "2rem" }}>
				<Skeleton height={400} variant="rounded" />
			</Container>
		);
	}

	return (
		<Container>
			<Paper sx={{ padding: 3, marginTop: 2 }}>
				<Typography variant="h5" gutterBottom>
					User Management
				</Typography>

				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Profile</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Affiliation</TableCell>
								<TableCell>Department</TableCell>
								<TableCell align="center">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										{user.picture.data.length > 0 ? (
											<Avatar
												src={convertImage(user.picture.data)}
												alt={`${user.first_name} ${user.last_name}`}
											/>
										) : (
											<AccountCircle
												sx={{
													height: 45,
													width: 45,
												}}
											/>
										)}
									</TableCell>
									<TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.role ? user.role.name : "N/A"}</TableCell>
									<TableCell>
										{user.affiliation ? user.affiliation.name : "N/A"}
									</TableCell>
									<TableCell>
										{user.department ? user.department.name : "N/A"}
									</TableCell>
									<TableCell align="center">
										<Button
											variant="contained"
											color="primary"
											onClick={() => handlePromote(user.id)}
											sx={{ mb: 0.5, width: 110 }}
											disabled={buttonLoading}>
											Promote
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => handleDelegate(user.id)}
											disabled={buttonLoading}>
											Delegate
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<Pagination
					count={pagination.pages}
					page={pagination.currentPage}
					onChange={handlePageChange}
					sx={{
						mt: 3,
						display: "flex",
						justifyContent: "center",
						"& .MuiPaginationItem-root": {
							color: "primary.main",
						},
					}}
				/>
			</Paper>
			{(msg || err) && (
				<Snackbar
					open={open}
					autoHideDuration={3000}
					onClose={handleClose}
					message={msg ? msg : err}
					action={action}
					color={msg ? "green" : "red"}
				/>
			)}
		</Container>
	);
};

export default UsersPage;
