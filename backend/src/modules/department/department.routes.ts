import { Router } from "express";
import { auditLogger } from "../../middlewares/auditLogger.js";
import { authMiddleware, authUser } from "../../middlewares/authMiddleware.js";
import { addDepartment } from "./controllers/addDepartment.js";
import { deleteDepartment } from "./controllers/deleteDepartment.js";
import { getDepartments } from "./controllers/getDepartments.js";
import { updateDepartment } from "./controllers/updateDepartment.js";

const departmentRoutes = Router();

departmentRoutes.get("/:id", getDepartments);

departmentRoutes.use(authMiddleware, authUser(["Admin"]), auditLogger());

departmentRoutes.post("/", addDepartment);

departmentRoutes.delete("/:id", deleteDepartment);

departmentRoutes.put("/", updateDepartment);

export default departmentRoutes;
