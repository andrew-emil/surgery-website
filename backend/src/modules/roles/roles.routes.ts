import { Router } from "express";
import { addRole } from "./controllers/addRole.js";
import { deleteRole } from "./controllers/deleteRole.js";
import { getAllRoles } from "./controllers/getAllRoles.js";
import { updateRole } from "./controllers/updateRole.js";
import { auditLogger } from "./../../middlewares/auditLogger.js";

const rolesRoutes = Router();

rolesRoutes.get("/", getAllRoles);

//middleware
rolesRoutes.use(auditLogger());

//routes...
rolesRoutes.post("/", addRole);
rolesRoutes.delete("/:id", deleteRole);
rolesRoutes.put("/", updateRole);

export default rolesRoutes;
