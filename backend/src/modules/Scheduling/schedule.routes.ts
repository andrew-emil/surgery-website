import { Router } from "express";
import { getAvailabilityCalendar } from "./controllers/getAvailabilityCalendar.js";
import { getRecommendedStaff } from "./controllers/getRecommendedStaff.js";
import { getConflictResolutionData } from "./controllers/getConflictResolutionData.js";

const scheduleRoutes = Router();

scheduleRoutes.get("/availability-calendar/:userId", getAvailabilityCalendar);
scheduleRoutes.get("/recommend-staff", getRecommendedStaff);
scheduleRoutes.get("/confliction-data", getConflictResolutionData);

export default scheduleRoutes;
