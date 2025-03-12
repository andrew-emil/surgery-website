import { Router } from "express";
import { createRequest } from "./controllers/createRequest.js";
import { approveRequest } from "./controllers/aprroveRequest.js";
import { cancelRequest } from "./controllers/cancelRequest.js";
import { getRequests } from "./controllers/getRequests.js";

const authRequestsRoutes = Router();

authRequestsRoutes.post("/", createRequest);
authRequestsRoutes.put("/:id/approve", approveRequest);
authRequestsRoutes.put("/:id/cancel", cancelRequest);
authRequestsRoutes.get("/:surgeryId/request", getRequests);

export default authRequestsRoutes;
