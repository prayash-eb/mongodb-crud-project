import { Router } from "express";
import { addUserAddress, addToCart, removeFromCart, userLogin, userRegister } from "../controllers/user.controller.js";
import { requireAuthentication } from "../middleware/auth.middleware.js";

const userRouter = Router()

userRouter.post("/register", userRegister)
userRouter.post("/login", userLogin)
userRouter.patch("/add-address", requireAuthentication, addUserAddress)
userRouter.post("/add-to-cart", addToCart)
userRouter.post("/remove-from-cart", removeFromCart)
export default userRouter