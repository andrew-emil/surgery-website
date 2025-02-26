import { Router } from "express";
import { login } from "./controllers/login.js";
import { deleteAccount } from "./controllers/deleteAccount.js";
import { verify2FA } from "./controllers/verify2FA.js";
import { register } from "./controllers/register.js";
import { forgetPassword } from "./controllers/forgetPassword.js";
import { resetPassword } from "./controllers/resetPassword.js";
import { updateAccount } from "./controllers/updateAccount.js";

const usersRoutes = Router();

//user routes...
usersRoutes.post("/login", login);
usersRoutes.post("/register", register);
usersRoutes.post("/verify", verify2FA);
usersRoutes.post("/forget-password", forgetPassword);
usersRoutes.post("/reset-password", resetPassword);

//middleware routes


//protected routes
usersRoutes.delete("/deleteAccount/:id", deleteAccount);
usersRoutes.put("/update-account", updateAccount);

export default usersRoutes;
