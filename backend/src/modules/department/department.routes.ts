import { Router } from "express";
import { addDepartment } from "./controllers/addDepartment.js";

const departmentRoutes = Router();

//middlewares


//department routes
departmentRoutes.post("/", addDepartment)


export default departmentRoutes;