import { Router } from "express";
import { addDepartment } from "./controllers/addDepartment.js";
import { deleteDepartment } from "./controllers/deleteDepartment.js";
import { getDepartments } from "./controllers/getDepartments.js";
import { updateDepartment } from "./controllers/updateDepartment.js";
import { getDoctorsDepartment } from "./controllers/getDoctorsDepartment.js";
import { auditLogger } from "../../middlewares/auditLogger.js";

const departmentRoutes = Router();

departmentRoutes.get("/:id", getDepartments)
departmentRoutes.get("/get-doctors/:id", getDoctorsDepartment)

//middlewares
departmentRoutes.use(auditLogger())

//department routes
departmentRoutes.post("/", addDepartment)
departmentRoutes.delete("/:id", deleteDepartment)
departmentRoutes.put("/", updateDepartment)


export default departmentRoutes;