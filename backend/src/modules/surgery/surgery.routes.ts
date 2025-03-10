import { Router } from "express";
import { addSurgeryType } from "./controllers/addSurgeryType.js";
import { addSurgery } from "./controllers/addSurgery.js";
import { getSurgery } from "./controllers/getSurgery.js";
import { addPostSurgery } from "./controllers/addPostSurgery.js";
import { auditLogger } from "../../middlewares/auditLogger.js";

const surgeryRoutes = Router();

surgeryRoutes.get("/:id", getSurgery);

//middleware
surgeryRoutes.use(auditLogger);

//routes
surgeryRoutes.post("/add-type", addSurgeryType);
surgeryRoutes.post("/", addSurgery);
surgeryRoutes.post("/post-surgery", addPostSurgery);

export default surgeryRoutes;
