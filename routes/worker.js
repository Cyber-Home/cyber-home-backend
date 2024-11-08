import { Router } from "express";
import { getAssignedTasks, getWorkerTasks, updateAvailability, updateTaskStatus } from "../controllers/worker.js";
import auth from "../middleware/auth.js";

const workerRouter = Router();

workerRouter.get('/tasks', [auth], getAssignedTasks);
workerRouter.patch('/tasks/:id', [auth], updateTaskStatus);
workerRouter.patch('/availability', [auth], updateAvailability);

export default workerRouter;