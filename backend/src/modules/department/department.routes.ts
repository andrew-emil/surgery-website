import { Router } from "express";
import { addDepartment } from "./controllers/addDepartment.js";
import { deleteDepartment } from "./controllers/deleteDepartment.js";
import { getDepartments } from "./controllers/getDepartments.js";
import { updateDepartment } from "./controllers/updateDepartment.js";
import { getDoctorsDepartment } from "./controllers/getDoctorsDepartment.js";
import { auditLogger } from "../../middlewares/auditLogger.js";
import { authUser } from "../../middlewares/authMiddleware.js";

const departmentRoutes = Router();

departmentRoutes.get("/:id", getDepartments);
departmentRoutes.get(
	"/get-doctors/:id",
	authUser(["Admin"]),
	getDoctorsDepartment
);

//middlewares
departmentRoutes.use(auditLogger());

//department routes
departmentRoutes.post("/", authUser(["Admin"]), addDepartment);
departmentRoutes.delete("/:id", authUser(["Admin"]), deleteDepartment);
departmentRoutes.put("/", authUser(["Admin"]), updateDepartment);

export default departmentRoutes;
