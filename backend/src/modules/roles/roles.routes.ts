import { Router } from "express";
import { addRole } from "./controllers/addRole.js";
import { deleteRole } from "./controllers/deleteRole.js";
import { getAllRoles } from "./controllers/getAllRoles.js";
import { updateRole } from "./controllers/updateRole.js";
import { auditLogger } from "./../../middlewares/auditLogger.js";
import { authMiddleware, authUser } from "../../middlewares/authMiddleware.js";
import { assignPermissions } from "./controllers/assignPermissions.js";

const rolesRoutes = Router();

rolesRoutes.get("/", getAllRoles);

//middleware
rolesRoutes.use(auditLogger());
rolesRoutes.use(authMiddleware);

//routes...
rolesRoutes.post("/", authUser(["Admin", "Consultant"]), addRole);
rolesRoutes.delete("/:id", authUser(["Admin", "Consultant"]), deleteRole);
rolesRoutes.put("/", authUser(["Admin", "Consultant"]), updateRole);
rolesRoutes.put(
	"/assign-perm",
	authUser(["Admin", "Consultant"]),
	assignPermissions
);

export default rolesRoutes;
