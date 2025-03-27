import { Router } from "express";
import { addSurgery } from "./controllers/addSurgery.js";
import { getSurgery } from "./controllers/getSurgery.js";
import { addPostSurgery } from "./controllers/addPostSurgery.js";
import { auditLogger } from "../../middlewares/auditLogger.js";
import { searchSurgery } from "./controllers/searchSurgery.js";
import { deleteSurgery } from "./controllers/deleteSurgery.js";
import { updateSurgery } from "./controllers/updateSurgery.js";
import { getSurgeriesWithOpenSlots } from "./controllers/getSurgeriesWithOpenSlots.js";

const surgeryRoutes = Router();

surgeryRoutes.get("/get-surgrey/:id", getSurgery);
surgeryRoutes.get("/search", searchSurgery);
surgeryRoutes.get("/open-slots", getSurgeriesWithOpenSlots);

//middleware
surgeryRoutes.use(auditLogger());

//routes
surgeryRoutes.post("/", addSurgery);
surgeryRoutes.post("/post-surgery", addPostSurgery);
surgeryRoutes.delete("/:id", deleteSurgery);
surgeryRoutes.put("/", updateSurgery);

export default surgeryRoutes;
