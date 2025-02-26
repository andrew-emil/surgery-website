import { Router } from "express";
import { addRole } from "./controllers/addRole.js";
import { deleteRole } from "./controllers/deleteRole.js";
import { getAllRoles } from "./controllers/getAllRoles.js";
import { updateRole } from "./controllers/updateRole.js";

const rolesRoutes = Router()

//middleware
//TODO: only admins should change in the roles

//routes
rolesRoutes.post("/add-role", addRole)
rolesRoutes.delete('/delete-role/:id', deleteRole)
rolesRoutes.get('/all-roles', getAllRoles)
rolesRoutes.put('/update-role', updateRole)

export default rolesRoutes;