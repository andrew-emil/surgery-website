import { Router } from "express";
import { addSurgeryType } from "./controllers/addSurgeryType.js";
import { addSurgery } from "./controllers/addSurgery.js";
import { getSurgery } from "./controllers/getSurgery.js";

const surgeryRoutes = Router();

//middleware

//routes
surgeryRoutes.post('/add-type', addSurgeryType)
surgeryRoutes.post('/', addSurgery)
surgeryRoutes.get('/:id', getSurgery)

export default surgeryRoutes;