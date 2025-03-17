import { Router } from "express";
import { validateEquipmentPhoto } from "../../middlewares/filesMiddleware.js";
import { addSurgeryEquipment } from "./controllers/addSurgeryEquipment.js";
import { getSurgeryEquipments } from "./controllers/getSurgeryEquipments.js";

const surgeryEquiRoutes = Router()

surgeryEquiRoutes.get("/", getSurgeryEquipments)
surgeryEquiRoutes.post("/", validateEquipmentPhoto, addSurgeryEquipment)
surgeryEquiRoutes.delete("/")
surgeryEquiRoutes.put("/")


export default surgeryEquiRoutes;