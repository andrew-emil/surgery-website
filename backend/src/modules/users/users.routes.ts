import { Router } from "express";
import { login } from "./controllers/login.js";
import { deleteAccount } from "./controllers/deleteAccount.js";

const usersRoutes = Router();

//user routes...
usersRoutes.post("/login", login);
usersRoutes.delete("/deleteAccount/:id", deleteAccount);

export default usersRoutes;
