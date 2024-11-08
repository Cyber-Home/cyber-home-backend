import { Router } from "express";
import { isAthenticated } from "../middleware/auth.js";
import { addService, addWorker, assignTask, deleteService, deleteWorker, getAllTasks, getDashboardStats } from "../controllers/admin.js";
import { isAdmin } from "../middleware/admin.js"

const adminRouter = Router();

adminRouter.post('/workers', [isAthenticated, isAdmin], addWorker);
adminRouter.post('/services', [isAthenticated, isAdmin], addService);
adminRouter.get('/workers', [isAthenticated, isAdmin], getAllTasks);
adminRouter.post('/tasks/assign', [isAthenticated, isAdmin], assignTask);
adminRouter.get('/tasks', [isAthenticated, isAdmin], getAllTasks);
adminRouter.get('/tasks/:id', [isAthenticated, isAdmin], getDashboardStats);
adminRouter.delete('/workers/:id', [isAthenticated, isAdmin], deleteWorker);
adminRouter.delete('/services/:id', [isAthenticated, isAdmin], deleteService);

export default adminRouter;