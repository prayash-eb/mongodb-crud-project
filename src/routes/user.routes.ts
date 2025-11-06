import { Router } from "express";
import { userLogin, userRegister, addAddress, getProfile, updateProfile, removeAddress, getAddresses } from "../controllers/user.controller.js";
import { requireAuthentication } from "../middleware/auth.middleware.js";

const userRouter = Router()

userRouter.post("/register", userRegister)
userRouter.post("/login", userLogin)
userRouter.patch("/add-address", requireAuthentication, addAddress)
userRouter.patch("/remove-address", requireAuthentication, removeAddress)
userRouter.get("/addresses", requireAuthentication, getAddresses)
userRouter.get("/profile", requireAuthentication, getProfile)
userRouter.patch("/profile", requireAuthentication, updateProfile)

export default userRouter