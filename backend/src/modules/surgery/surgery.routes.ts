import { Router } from "express";
import { addSurgery } from "./controllers/addSurgery.js";
import { getSurgery } from "./controllers/getSurgery.js";
import { addPostSurgery } from "./controllers/addPostSurgery.js";
import { auditLogger } from "../../middlewares/auditLogger.js";
import { searchSurgery } from "./controllers/searchSurgery.js";
import { deleteSurgery } from "./controllers/deleteSurgery.js";
import { updateSurgery } from "./controllers/updateSurgery.js";
import { getSurgeriesWithOpenSlots } from "./controllers/getSurgeriesWithOpenSlots.js";
import { authUser } from "../../middlewares/authMiddleware.js";
import { getUserSurgeries } from "./controllers/getUserSurgeries.js";

const surgeryRoutes = Router();

surgeryRoutes.get("/get-surgrey/:id", getSurgery);
surgeryRoutes.get("/search", searchSurgery);
surgeryRoutes.get(
	"/open-slots",
	authUser(["Admin", "Consultant"]),
	getSurgeriesWithOpenSlots
);
surgeryRoutes.get("/surgeries", getUserSurgeries);

//middleware
surgeryRoutes.use(auditLogger());

//routes
surgeryRoutes.post("/", authUser(["Admin", "Consultant"]), addSurgery);
surgeryRoutes.post(
	"/post-surgery",
	authUser(["Admin", "Consultant"]),
	addPostSurgery
);
surgeryRoutes.delete("/:id", authUser(["Admin", "Consultant"]), deleteSurgery);
surgeryRoutes.put("/", authUser(["Admin", "Consultant"]), updateSurgery);

export default surgeryRoutes;
