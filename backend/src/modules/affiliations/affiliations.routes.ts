import { Router } from "express";
import { auditLogger } from "../../middlewares/auditLogger.js";
import { addAffiliation } from "./controllers/addAffiliation.js";
import { getAffiliations } from "./controllers/getAffiliations.js";

const affiliationRoutes = Router();

affiliationRoutes.get("/", getAffiliations);

affiliationRoutes.use(auditLogger);

affiliationRoutes.post("/", addAffiliation);

export default affiliationRoutes;
