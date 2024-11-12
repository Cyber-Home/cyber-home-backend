import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { addService, addWorker, assignTask, deleteService, deleteWorker, getAllTasks, getDashboardStats } from "../controllers/admin.js";
import { isAdmin } from "../middleware/admin.js"

const adminRouter = Router();

adminRouter.post('/workers', isAuthenticated, isAdmin, addWorker);
adminRouter.post('/services', isAuthenticated, isAdmin, addService);
adminRouter.get('/workers', isAuthenticated, isAdmin, getAllTasks);
adminRouter.post('/tasks/assign', isAuthenticated, isAdmin, assignTask);
adminRouter.get('/tasks', isAuthenticated, isAdmin, getAllTasks);
adminRouter.get('/tasks/:id', isAuthenticated, isAdmin, getDashboardStats);
adminRouter.delete('/workers/:id', isAuthenticated, isAdmin, deleteWorker);
adminRouter.delete('/services/:id', isAuthenticated, isAdmin, deleteService);

export default adminRouter;