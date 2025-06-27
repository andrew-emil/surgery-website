/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
	Avatar,
	ListItemAvatar,
	Alert,
	Rating,
	Button,
	Grid2,
	List,
	Box,
	Typography,
	Stack,
	Divider,
	ListItem,
	ListItemText,
} from "@mui/material";
import { convertImage } from "./../../utils/convertImage";
import { decodeJWTToken } from "./../../utils/decodeToken";
import { FormTextField, FormButton } from "../StyledComponents";
import { Star, Person } from "@mui/icons-material";
import axiosClient from "../../axiosClient";

//TODO: add the api requests to the services
//TODO: add action
export default function RatingsSection({
	surgeryData,
	token,
	updateRatingsState,
}) {
	const [newRatingStars, setNewRatingStars] = useState(0);
	const [newRatingComment, setNewRatingComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState(null);
	const [editingRatingId, setEditingRatingId] = useState(null);
	const [editingRatingStars, setEditingRatingStars] = useState(0);
	const [editingRatingComment, setEditingRatingComment] = useState("");

	async function isAuthorizedToRate() {
		if (!token) return false;
		const { id } = await decodeJWTToken(token);

		return (
			surgeryData.team.some((member) => member.id === id) ||
			id === surgeryData.metadata.leadSurgeonId
		);
	}

	const handleRatingSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setFormError(null);
		try {
			const payload = {
				surgeryId: surgeryData.metadata.id,
				stars: newRatingStars,
				comment: newRatingComment.trim(),
			};
			const { data: responseData } = await axiosClient.post(
				"/rating",
				payload,
				{
					withCredentials: true,
				}
			);
			const newRating = responseData.data;
			updateRatingsState([...surgeryData.ratings.breakdown, newRating]);
			setNewRatingStars(0);
			setNewRatingComment("");
		} catch (error) {
			setFormError(error.response?.data?.message || "Failed to submit rating");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEditRating = (review) => {
		setEditingRatingId(review.id);
		setEditingRatingStars(review.stars);
		setEditingRatingComment(review.comment);
	};

	const cancelEditing = () => {
		setEditingRatingId(null);
	};

	const handleUpdateRating = async (e, ratingId) => {
		e.preventDefault();
		try {
			const { data: responseData } = await axiosClient.patch(
				`/rating/${ratingId}`,
				{
					stars: editingRatingStars,
					comment: editingRatingComment,
				},
				{ withCredentials: true }
			);
			const updatedRating = responseData.data;
			const updatedBreakdown = surgeryData.ratings.breakdown.map((r) =>
				r.id === ratingId ? updatedRating : r
			);
			updateRatingsState(updatedBreakdown);
			setEditingRatingId(null);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteRating = async (ratingId) => {
		try {
			await axiosClient.delete(`/rating/${ratingId}`, {
				withCredentials: true,
			});
			const updatedBreakdown = surgeryData.ratings.breakdown.filter(
				(r) => r.id !== ratingId
			);
			updateRatingsState(updatedBreakdown);
		} catch (error) {
			console.error(error);
		}
	};

	const renderRatingReview = (review, index) => {
		const isEditing = editingRatingId === review.id;
		const isUserReview = token && review.user && review.user.id === token.id;
		return (
			<React.Fragment key={review.id}>
				<ListItem alignItems="flex-start">
					<ListItemAvatar>
						<Avatar
							src={
								review.user?.picture?.data
									? convertImage(review.user.picture.data)
									: null
							}>
							{review.user ? review.user.name.split(" ")[1][0] : <Person />}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={
							<>
								<Rating
									value={review.stars}
									precision={0.5}
									readOnly
									size="small"
								/>
								<Typography
									component="span"
									variant="body2"
									color="text.secondary"
									sx={{ display: "flex" }}>
									{review.user?.name || "Anonymous"}
								</Typography>
							</>
						}
						secondary={
							<>
								{isEditing ? (
									<form onSubmit={(e) => handleUpdateRating(e, review.id)}>
										<Box sx={{ mt: 1 }}>
											<Stack spacing={2}>
												<Rating
													name="edit-rating"
													value={editingRatingStars}
													precision={0.5}
													onChange={(e, newValue) =>
														setEditingRatingStars(newValue)
													}
												/>
												<FormTextField
													label="Comment"
													variant="outlined"
													fullWidth
													multiline
													rows={2}
													value={editingRatingComment}
													onChange={(e) =>
														setEditingRatingComment(e.target.value)
													}
												/>
												<Box sx={{ display: "flex", gap: 1 }}>
													<Button type="submit" variant="contained">
														Save
													</Button>
													<Button variant="outlined" onClick={cancelEditing}>
														Cancel
													</Button>
												</Box>
											</Stack>
										</Box>
									</form>
								) : (
									<>
										<Typography
											component="span"
											variant="body2"
											color="text.primary">
											{review.comment}
										</Typography>
										{isUserReview && (
											<Box sx={{ mt: 1 }}>
												<Button
													variant="outlined"
													size="small"
													onClick={() => handleEditRating(review)}
													sx={{ mr: 1 }}>
													Update
												</Button>
												<Button
													variant="outlined"
													size="small"
													color="error"
													onClick={() => handleDeleteRating(review.id)}>
													Delete
												</Button>
											</Box>
										)}
									</>
								)}
								<Typography
									component="div"
									variant="caption"
									color="text.secondary">
									{new Date(review.createdAt).toLocaleDateString()}
								</Typography>
							</>
						}
					/>
				</ListItem>
				{index < surgeryData.ratings.breakdown.length - 1 && <Divider />}
			</React.Fragment>
		);
	};

	return (
		<Box mt={3}>
			<Typography variant="h6" gutterBottom>
				<Star sx={{ verticalAlign: "middle", mr: 1 }} />
				Ratings & Reviews
			</Typography>

			<Grid2 container spacing={3} alignItems="center" mb={3}>
				<Grid2 item>
					<Typography variant="h2" component="div">
						{surgeryData.ratings?.average.toFixed(1) || "0"}
					</Typography>
				</Grid2>
				<Grid2 item>
					<Rating
						value={surgeryData.ratings?.average || 0}
						precision={0.5}
						readOnly
						size="large"
					/>
					<Typography variant="body2" color="text.secondary">
						{surgeryData.ratings?.count || "0"} reviews
					</Typography>
				</Grid2>
			</Grid2>
			{surgeryData.ratings?.breakdown.length > 0 && surgeryData.ratings ? (
				<List>
					{surgeryData.ratings.breakdown.map((review, index) =>
						renderRatingReview(review, index)
					)}
				</List>
			) : (
				<Typography variant="body2" color="text.secondary">
					No reviews yet
				</Typography>
			)}
			{/* New Rating Form */}
			<form onSubmit={handleRatingSubmit}>
				<Box mt={3}>
					<Typography variant="h6" gutterBottom>
						Add Your Rating
					</Typography>
					{!isAuthorizedToRate && (
						<Alert severity="warning" sx={{ marginY: "1rem" }}>
							You are not authorized to add a rating for this surgery.
						</Alert>
					)}
					<Stack spacing={2}>
						<Rating
							name="new-rating"
							value={newRatingStars}
							precision={0.5}
							onChange={(e, newValue) => setNewRatingStars(newValue)}
							disabled={!isAuthorizedToRate}
						/>
						<FormTextField
							label="Comment"
							variant="outlined"
							fullWidth
							multiline
							rows={3}
							value={newRatingComment}
							onChange={(e) => setNewRatingComment(e.target.value)}
							disabled={!isAuthorizedToRate}
						/>
						{formError && <Alert severity="error">{formError}</Alert>}
						<FormButton
							variant="contained"
							type="submit"
							disabled={
								!isAuthorizedToRate || isSubmitting || newRatingStars === 0
							}>
							{isSubmitting ? "Submitting..." : "Submit Rating"}
						</FormButton>
					</Stack>
				</Box>
			</form>
		</Box>
	);
}
