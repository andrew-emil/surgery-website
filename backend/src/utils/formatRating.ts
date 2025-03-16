import { Rating } from "../entity/mongodb/Rating.js";

export const formatRatings = (ratings: Rating[]) => {
	if (!ratings.length) return null;

	const average =
		ratings.reduce((sum, r) => sum + (r.stars || 0), 0) / ratings.length;

	return {
		average: Math.round(average * 10) / 10,
		count: ratings.length,
		breakdown: ratings.map((r) => ({
			stars: r.stars,
			feedback: r.comments || null,
			createdAt: r.createdAt,
		})),
	};
};
