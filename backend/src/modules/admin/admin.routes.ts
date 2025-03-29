import { Router } from "express";
import { getPendingUsers } from "./controllers/getPendingUsers.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { approveUserAccount } from "./controllers/aprroveUserAccount.js";
import { rejectUserAccount } from "./controllers/rejectUserAcount.js";
import { getSuccessRates } from "./controllers/getSuccessRates.js";
import { getComplications } from "./controllers/getComplications.js";
import { getPerformance } from "./controllers/getTeamPerformance.js";

const adminRoutes = Router();

adminRoutes.use(authMiddleware);

adminRoutes.get("/pending-users", getPendingUsers);
adminRoutes.patch("/approve-user/:userId", approveUserAccount);
adminRoutes.patch("/reject-user/:userId", rejectUserAccount);
adminRoutes.get("/dashboard/success-rates", getSuccessRates);
adminRoutes.get("/dashboard/complication-trends", getComplications);
adminRoutes.get("/dashboard/team-performance/:affiliationId", getPerformance);

export default adminRoutes;
