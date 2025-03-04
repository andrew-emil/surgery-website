import { Router } from "express";
import { auditLogger } from "../../middlewares/auditLogger.js";
import { addAffiliation } from "./controllers/addAffiliation.js";

const affiliationRoutes = Router();

affiliationRoutes.use(auditLogger);

affiliationRoutes.post("/", addAffiliation);

export default affiliationRoutes;
