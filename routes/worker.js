import { Router } from "express";
import { getAssignedTasks, updateAvailability, updateTaskStatus } from "../controllers/worker.js";
import { isAthenticated } from "../middleware/auth.js";

const workerRouter = Router();

workerRouter.get('/tasks', [isAthenticated], getAssignedTasks);
workerRouter.patch('/tasks/:id', [isAthenticated], updateTaskStatus);
workerRouter.patch('/availability', [isAthenticated], updateAvailability);

export default workerRouter;