import { Router } from "express";
import { createTask, deleteTask, getUserTasks, updateTask } from "../controllers/task.js";
import { isAuthenticated } from "../middleware/auth.js";
import { remoteUpload } from "../middleware/upload.js";

const taskRouter = Router();

taskRouter.post('/tasks', [isAuthenticated], remoteUpload.single('upload'), createTask);
taskRouter.get('/tasks', [isAuthenticated], getUserTasks);
taskRouter.patch('/tasks/:id', [isAuthenticated], updateTask);
taskRouter.delete('/tasks/:id', [isAuthenticated], deleteTask);

export default taskRouter;