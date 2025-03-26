import { Router } from "express";
import { getPendingUsers } from "./controllers/getPendingUsers.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { approveUserAccount } from "./controllers/aprroveUserAccount.js";
import { rejectUserAccount } from "./controllers/rejectUserAcount.js";

const adminRoutes = Router();

adminRoutes.use(authMiddleware);

adminRoutes.get("/pending-users", getPendingUsers);
adminRoutes.patch("/approve-user/:userId", approveUserAccount);
adminRoutes.patch("/reject-user/:userId", rejectUserAccount);

export default adminRoutes;
