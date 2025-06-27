import { Router } from "express";
import { validateEquipmentPhoto } from "../../middlewares/filesMiddleware.js";
import { addSurgeryEquipment } from "./controllers/addSurgeryEquipment.js";
import { getSurgeryEquipments } from "./controllers/getSurgeryEquipments.js";
import { deleteEquipment } from "./controllers/deleteEquipment.js";
import { updateEquipment } from "./controllers/updateEquipment.js";
import { authUser } from "../../middlewares/authMiddleware.js";
import { auditLogger } from "../../middlewares/auditLogger.js";
import { getEquipmentById } from "./controllers/getEquipmentById.js";

const surgeryEquipRoutes = Router();

surgeryEquipRoutes.use(authUser(["Admin", "Consultant"]));
surgeryEquipRoutes.get("/", getSurgeryEquipments);
surgeryEquipRoutes.get("/:id", getEquipmentById);

surgeryEquipRoutes.delete("/:id", auditLogger(), deleteEquipment);

surgeryEquipRoutes.use(validateEquipmentPhoto, auditLogger());

surgeryEquipRoutes.post("/", addSurgeryEquipment);
surgeryEquipRoutes.put("/:id", updateEquipment);

export default surgeryEquipRoutes;
