import { Router } from "express";
import { getSuccessRate } from "./controllers/getSuccessRate.js";

const adminRoutes = Router();

adminRoutes.get("/dashboard/success-rate", getSuccessRate);
adminRoutes.get("/dashboard/complication-trends");
adminRoutes.get("/dashboard/team-performance");

export default adminRoutes;
