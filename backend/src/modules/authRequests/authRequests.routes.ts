import { Router } from "express";
import { createRequest } from "./controllers/createRequest.js";
import { approveRequest } from "./controllers/aprroveRequest.js";
import { rejectRequest } from "./controllers/cancelRequest.js";
import { getRequests } from "./controllers/getRequests.js";
import { editRequest } from "./controllers/editRequest.js";
import { deleteRequest } from "./controllers/deleteRequest.js";

const authRequestsRoutes = Router();

authRequestsRoutes.post("/", createRequest);
authRequestsRoutes.put("/:id/approve", approveRequest);
authRequestsRoutes.put("/:id/reject", rejectRequest);
authRequestsRoutes.get("/:surgeryId/request", getRequests);
authRequestsRoutes.put("/", editRequest);
authRequestsRoutes.delete("/:id", deleteRequest);

export default authRequestsRoutes;
