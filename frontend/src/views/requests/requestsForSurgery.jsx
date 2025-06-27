import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Container,
	Divider,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { FormButton } from "../../components/StyledComponents";
import { useStateContext } from "../../context/contextprovider";
import { handleApproveOrRejectRequest } from "../../services/apiRequestSurgery";

export default function RequestsForSurgery() {
	const { user } = useStateContext();
	const requestsData = useLoaderData();

	const [requests, setRequests] = useState(requestsData);
	const [msg, setMsg] = useState(null);
	const [err, setErr] = useState(null);
	const [loading, setLoading] = useState(false);

	async function handlingApproveOrRejectRequest(isApproved, id) {
		setLoading(true);
		const response = await handleApproveOrRejectRequest(isApproved, id);
		if (response.error) {
			setErr(response.error);
		} else if (response.message) {
			setRequests((prev) => prev.filter((req) => req.id !== id));
			setMsg(response.message);
		}

		setLoading(false);
	}

	return (
		<Container sx={{ py: 4, display: "flex", flexDirection: "column", gap: 4 }}>
			{msg && (
				<Box bgcolor="success.light" p={2} borderRadius={2} textAlign="center">
					<Typography color="success.main">{msg}</Typography>
				</Box>
			)}

			{err && (
				<Box bgcolor="error" p={2} borderRadius={2} textAlign="center">
					<Typography color="error.main">
						No requests for this surgery
					</Typography>
				</Box>
			)}
			{requests.map((request, index) => (
				<Card
					key={request.id}
					sx={{ width: "100%", borderRadius: 3, boxShadow: 3 }}>
					<CardHeader
						title={`Request #${index + 1}`}
						subheader={`Status: ${request.status}`}
						slotProps={{
							title: { variant: "h6", fontWeight: 600 },
							subheader: { color: "text.secondary" },
						}}
					/>
					<Divider />
					<CardContent>
						<Typography variant="subtitle1" gutterBottom>
							Created At: {new Date(request.created_at).toLocaleString()}
						</Typography>

						{request.approvedAt && (
							<Typography variant="subtitle1" color="success.main">
								Approved At: {new Date(request.approvedAt).toLocaleString()}
							</Typography>
						)}

						{request.rejectionReason && (
							<Typography variant="subtitle1" color="error">
								Rejection Reason: {request.rejectionReason}
							</Typography>
						)}

						<Divider sx={{ my: 2 }} />

						<Box
							display="flex"
							gap={4}
							flexWrap="wrap"
							justifyContent="space-between">
							<Box id="surgery-info" display={"flex"} gap={3}>
								<Box>
									<Typography variant="h6" gutterBottom>
										Trainee Info
									</Typography>
									<Typography>
										Name: {request.trainee?.first_name}{" "}
										{request.trainee?.last_name}
									</Typography>
									<Typography>Email: {request.trainee?.email}</Typography>
									<Typography>
										Phone: {request.trainee?.phone_number}
									</Typography>
								</Box>
								<Box>
									<Typography variant="h6" gutterBottom>
										Consultant Info
									</Typography>
									<Typography>
										Name: {request.consultant.first_name}{" "}
										{request.consultant.last_name}
									</Typography>
									<Typography>Email: {request.consultant.email}</Typography>
									<Typography>
										Phone: {request.consultant.phone_number}
									</Typography>
								</Box>
							</Box>

							<Box
								alignSelf={"flex-end"}
								display="flex"
								flexDirection="column"
								gap={2}>
								<FormButton
									type="button"
									variant="contained"
									className="btn btn-black btn-block"
									onClick={() =>
										handlingApproveOrRejectRequest(true, request.id)
									}
									disabled={user.id !== request.consultant.id}
									loading={loading}>
									Approve
								</FormButton>
								<FormButton
									type="button"
									variant="contained"
									className="btn btn-black btn-block"
									onClick={() =>
										handlingApproveOrRejectRequest(false, request.id)
									}
									disabled={user.id !== request.consultant.id}
									loading={loading}>
									Reject
								</FormButton>
							</Box>
						</Box>
					</CardContent>
				</Card>
			))}
		</Container>
	);
}
