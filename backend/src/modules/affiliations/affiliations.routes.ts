import { Router } from "express";
import { auditLogger } from "../../middlewares/auditLogger.js";
import { addAffiliation } from "./controllers/addAffiliation.js";
import { getAffiliations } from "./controllers/getAffiliations.js";
import { deleteAffiliation } from "./controllers/deleteAffiliation.js";
import { updateAffiliation } from "./controllers/updateAffiliation.js";

const affiliationRoutes = Router();

affiliationRoutes.get("/", getAffiliations);

affiliationRoutes.use(auditLogger);

affiliationRoutes.post("/", addAffiliation);
affiliationRoutes.delete("/:id", deleteAffiliation);
affiliationRoutes.patch("/", updateAffiliation);

export default affiliationRoutes;
