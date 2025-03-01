import { Router } from "express";
import { addRole } from "./controllers/addRole.js";
import { deleteRole } from "./controllers/deleteRole.js";
import { getAllRoles } from "./controllers/getAllRoles.js";
import { updateRole } from "./controllers/updateRole.js";

const rolesRoutes = Router()

//middleware
//TODO: only admins should change in the roles

//routes
rolesRoutes.post("/", addRole)
rolesRoutes.delete('/:id', deleteRole)
rolesRoutes.get('/', getAllRoles)
rolesRoutes.put('/', updateRole)

export default rolesRoutes;