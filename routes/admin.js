import { Router } from "express";
import auth from "../middleware/auth.js";
import { addService, addWorker, assignTask, deleteService, deleteWorker, getAllTasks, getDashboardStats } from "../controllers/admin.js";
import isaDmin from "../middleware/admin.js"

const adminRouter = Router();

router.post('/workers', [auth, isaDmin], addWorker);
router.post('/services', [auth, isaDmin], addService);
router.get('/workers', [auth, isaDmin], getAllTasks);
router.post('/tasks/assign', [auth, isaDmin], assignTask);
router.get('/tasks', [auth, isaDmin], getAllTasks);
router.get('/tasks/:id', [auth, isaDmin], getDashboardStats);
router.delete('/workers/:id', [auth, isaDmin], deleteWorker);
router.delete('/services/:id', [auth, isaDmin], deleteService);

export default adminRouter;