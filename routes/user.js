import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { register, login, updateProfile, getProfile } from "../controllers/user.js";

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/profile', [isAuthenticated], getProfile);
userRouter.patch('/profile', [isAuthenticated], updateProfile);

export default userRouter;