import { Router } from "express";
import { createTask, deleteTask, getUserTasks, updateTask } from "../controllers/task.js";
import auth from "../middleware/auth.js";

const taskRouter = Router();

taskRouter.post('/tasks', [auth], createTask);
taskRouter.get('/tasks', [auth], getUserTasks);
taskRouter.patch('/tasks/:id', [auth], updateTask);
taskRouter.delete('/tasks/:id', [auth], deleteTask);

export default taskRouter;