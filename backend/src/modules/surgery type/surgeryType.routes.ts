import { Router } from "express";
import { addSurgeryType } from "../surgery type/controllers/addSurgeryType.js";

const surgeryTypeRoutes = Router()

surgeryTypeRoutes.post("/", addSurgeryType);


export default surgeryTypeRoutes