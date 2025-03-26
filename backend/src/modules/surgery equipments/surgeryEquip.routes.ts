import { Router } from "express";
import { validateEquipmentPhoto } from "../../middlewares/filesMiddleware.js";
import { addSurgeryEquipment } from "./controllers/addSurgeryEquipment.js";
import { getSurgeryEquipments } from "./controllers/getSurgeryEquipments.js";
import { deleteEquipment } from "./controllers/deleteEquipment.js";
import { updateEquipment } from "./controllers/updateEquipment.js";

const surgeryEquiRoutes = Router()

surgeryEquiRoutes.get("/", getSurgeryEquipments)
surgeryEquiRoutes.post("/", validateEquipmentPhoto, addSurgeryEquipment)
surgeryEquiRoutes.delete("/:id", deleteEquipment)
surgeryEquiRoutes.put("/:id", validateEquipmentPhoto, updateEquipment);


export default surgeryEquiRoutes;