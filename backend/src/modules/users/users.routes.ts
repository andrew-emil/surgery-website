import { Router } from "express";
import { login } from "./controllers/login.js";
import { deleteAccount } from "./controllers/deleteAccount.js";
import { verify2FA } from "./controllers/verify2FA.js";
import { register } from "./controllers/register.js";
import { forgetPassword } from "./controllers/forgetPassword.js";
import { resetPassword } from "./controllers/resetPassword.js";
import { updateAccount } from "./controllers/updateAccount.js";
import { auditLogger } from "../../middlewares/auditLogger.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { validateUserPhoto } from "../../middlewares/filesMiddleware.js";
import { getUserData } from "./controllers/getUserData.js";
import { getTrainingProgress } from "./controllers/getTrainingProgress.js";
import { getRoleRequirement } from "./controllers/getRoleRequirement.js";


const usersRoutes = Router();

usersRoutes.post("/forget-password", forgetPassword);

usersRoutes.post("/login", auditLogger("Login"), login);

usersRoutes.post(
	"/register",
	validateUserPhoto,
	auditLogger("Signup"),
	register
);

usersRoutes.post("/verify", auditLogger("Verify"), verify2FA);

usersRoutes.use(auditLogger())

usersRoutes.post("/reset-password", resetPassword);

usersRoutes.use(authMiddleware);


usersRoutes.delete("/", deleteAccount);
usersRoutes.patch("/", validateUserPhoto, updateAccount);
usersRoutes.get("/", getUserData);
usersRoutes.get("/training/progress", getTrainingProgress);
usersRoutes.get("/roles/requirements", getRoleRequirement);




export default usersRoutes;
