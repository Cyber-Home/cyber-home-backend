import { Router } from "express";
import { isAthenticated } from "../middleware/auth.js";
import { register, login, updateProfile, getProfile } from "../controllers/user.js";

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/profile', [isAthenticated], getProfile);
userRouter.patch('/profile', [isAthenticated], updateProfile);

export default userRouter;