import { Router } from "express";
import { createNotification } from "./controllers/createNotification.js";
import { getNotification } from "./controllers/getNotification.js";
import { markNotificationAsRead } from "./controllers/markNotificationAsRead.js";

const notificationRoutes = Router();

notificationRoutes.post("/", createNotification);
notificationRoutes.post("/:userId", getNotification);
notificationRoutes.put("/", markNotificationAsRead);

export default notificationRoutes;
