import { Router, Request, Response } from "express";
import { authUser } from "../../middlewares/authMiddleware.js";
import { addProcedureType } from "./controllers/addProcedureType.js";
import { getAllProcedureTypes } from "./controllers/getAllProcedureTypes.js";
import { updateProcedureType } from "./controllers/updateProcedureType.js";
import { deleteProcedureType } from "./controllers/deleteProcedureType.js";

const procedureTypeRoutes = Router();

procedureTypeRoutes.use(authUser(["Admin", "Consultant"]));

procedureTypeRoutes.post("/", addProcedureType);
procedureTypeRoutes.get("/", getAllProcedureTypes);
procedureTypeRoutes.put("/:id", updateProcedureType);
procedureTypeRoutes.delete("/:id", deleteProcedureType);

export default procedureTypeRoutes;
