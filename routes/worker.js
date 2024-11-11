import { Router } from "express";
import { getAssignedTasks, updateAvailability, updateTaskStatus } from "../controllers/worker.js";
import { isAuthenticated } from "../middleware/auth.js";

const workerRouter = Router();

workerRouter.get('/tasks', [isAuthenticated], getAssignedTasks);
workerRouter.patch('/tasks/:id', [isAuthenticated], updateTaskStatus);
workerRouter.patch('/availability', [isAuthenticated], updateAvailability);

export default workerRouter;