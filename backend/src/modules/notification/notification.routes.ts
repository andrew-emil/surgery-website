import { Router } from "express";
import { createNotification } from "./controllers/createNotification.js";
import { getNotification } from "./controllers/getNotification.js";

const notificationRoutes = Router();

notificationRoutes.post("/", createNotification);
notificationRoutes.post("/:userId", getNotification);

export default notificationRoutes;
