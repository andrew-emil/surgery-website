import { In } from "typeorm";
import { userRepo } from "../config/repositories.js";
import { Rating } from "../entity/mongodb/Rating.js";

export const formatRatings = async (ratings: Rating[]) => {
	if (!Array.isArray(ratings) || ratings.length === 0) return null;

	const userIds = [...new Set(ratings.map((r) => r.userId))];

	const users = await userRepo.find({
		where: { id: In(userIds) },
		select: ["id", "first_name", "last_name", "picture"],
	});

	const userMap = users.reduce((acc, user) => {
		acc[user.id] = {
			id: user.id,
			name: `Dr. ${user.first_name} ${user.last_name}`,
			picture: user.picture,
		};
		return acc;
	}, {});

	const average =
		ratings.reduce((sum, r) => sum + (r.stars || 0), 0) / ratings.length;

	const breakdown = ratings.map((r) => ({
		id: r.id,
		stars: r.stars,
		user: userMap[r.userId] || null,
		comment: r.comment?.trim() || null,
		createdAt: r.createdAt,
	}));

	return {
		average: Math.round(average * 10) / 10,
		count: ratings.length,
		breakdown,
	};
};
