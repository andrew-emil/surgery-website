import { Router } from "express";
import { addRole } from "./controllers/addRole.js";
import { deleteRole } from "./controllers/deleteRole.js";
import { getAllRoles } from "./controllers/getAllRoles.js";
import { updateRole } from "./controllers/updateRole.js";
import { auditLogger } from "./../../middlewares/auditLogger.js";
import { authUser } from "../../middlewares/authMiddleware.js";

const rolesRoutes = Router();

rolesRoutes.get("/", authUser(["Admin", "Consultant"]), getAllRoles);

//middleware
rolesRoutes.use(auditLogger());

//routes...
rolesRoutes.post("/", authUser(["Admin", "Consultant"]), addRole);
rolesRoutes.delete("/:id", authUser(["Admin", "Consultant"]), deleteRole);
rolesRoutes.put("/", authUser(["Admin", "Consultant"]), updateRole);

export default rolesRoutes;
