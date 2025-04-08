import { Router } from "express";
import { validateEquipmentPhoto } from "../../middlewares/filesMiddleware.js";
import { addSurgeryEquipment } from "./controllers/addSurgeryEquipment.js";
import { getSurgeryEquipments } from "./controllers/getSurgeryEquipments.js";
import { deleteEquipment } from "./controllers/deleteEquipment.js";
import { updateEquipment } from "./controllers/updateEquipment.js";
import { authUser } from "../../middlewares/authMiddleware.js";
import { auditLogger } from "../../middlewares/auditLogger.js";

const surgeryEquiRoutes = Router();

surgeryEquiRoutes.get(
	"/",
	authUser(["Admin", "Consultant"]),
	getSurgeryEquipments
);

surgeryEquiRoutes.use(auditLogger());

surgeryEquiRoutes.post(
	"/",
	authUser(["Admin", "Consultant"]),
	addSurgeryEquipment
);
surgeryEquiRoutes.delete("/:id", authUser(["Admin"]), deleteEquipment);
surgeryEquiRoutes.put(
	"/:id",
	authUser(["Admin"]),
	validateEquipmentPhoto,
	updateEquipment
);

export default surgeryEquiRoutes;
