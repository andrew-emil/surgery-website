import { Router } from "express";
import { addDepartment } from "./controllers/addDepartment.js";
import { deleteDepartment } from "./controllers/deleteDepartment.js";
import { getDepartments } from "./controllers/getDepartments.js";
import { updateDepartment } from "./controllers/updateDepartment.js";
import { getDoctorsDepartment } from "./controllers/getDoctorsDepartment.js";

const departmentRoutes = Router();

//middlewares


//department routes
departmentRoutes.post("/", addDepartment)
departmentRoutes.get("/", getDepartments)
departmentRoutes.get("/:id", getDoctorsDepartment)
departmentRoutes.delete("/:id", deleteDepartment)
departmentRoutes.put("/", updateDepartment)


export default departmentRoutes;