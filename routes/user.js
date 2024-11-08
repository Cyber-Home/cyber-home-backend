import { Router } from "express";
import auth from "../middleware/auth.js";
import { register, login, updateProfile, getProfile } from "../controllers/user.js";

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/profile', [auth], getProfile);
userRouter.patch('/profile', [auth], updateProfile);

export default userRouter;