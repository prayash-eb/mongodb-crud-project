import { Router } from "express";
import { addUserAddress, userLogin, userRegister } from "../controllers/user.controller.js";
import { requireAuthentication } from "../middleware/auth.middleware.js";

const userRouter = Router()

userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.patch('/add-address', requireAuthentication, addUserAddress)
export default userRouter