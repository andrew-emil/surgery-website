import { Router } from "express";
import { addSurgeryType } from "./controllers/addSurgeryType.js";

const surgeryRoutes = Router();

//middleware

//routes
surgeryRoutes.post('/add-type', addSurgeryType)

export default surgeryRoutes;