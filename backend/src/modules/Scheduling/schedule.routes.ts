import { Router } from "express";
import { getAvailabilityCalendar } from "./controllers/getAvailabilityCalendar.js";
import { getRecommendedStaff } from "./controllers/getRecommendedStaff.js";
import { getConflictResolutionData } from "./controllers/getConflictResolutionData.js";
import { authUser } from "../../middlewares/authMiddleware.js";

const scheduleRoutes = Router();

scheduleRoutes.post(
	"/availability-calendar/:userId",
	authUser(["Admin", "Consultant"]),
	getAvailabilityCalendar
);
scheduleRoutes.post(
	"/recommend-staff",
	authUser(["Admin", "Consultant"]),
	getRecommendedStaff
);
scheduleRoutes.post(
	"/confliction-data",
	authUser(["Admin", "Consultant"]),
	getConflictResolutionData
);

export default scheduleRoutes;
