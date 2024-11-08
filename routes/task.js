import { Router } from "express";
import { createTask, deleteTask, getUserTasks, updateTask } from "../controllers/task.js";
import { isAthenticated } from "../middleware/auth.js";

const taskRouter = Router();

taskRouter.post('/tasks', [isAthenticated], createTask);
taskRouter.get('/tasks', [isAthenticated], getUserTasks);
taskRouter.patch('/tasks/:id', [isAthenticated], updateTask);
taskRouter.delete('/tasks/:id', [isAthenticated], deleteTask);

export default taskRouter;