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

const usersRoutes = Router();

//user routes...
usersRoutes.post("/login", auditLogger, login);
usersRoutes.post("/register", auditLogger, register);
usersRoutes.post("/verify", auditLogger, verify2FA);
usersRoutes.post("/forget-password", forgetPassword);
usersRoutes.post("/reset-password", auditLogger, resetPassword);

usersRoutes.use(authMiddleware);
usersRoutes.use(auditLogger);

//protected routes
usersRoutes.delete("/:id", deleteAccount);
usersRoutes.patch("/", updateAccount);

export default usersRoutes;
