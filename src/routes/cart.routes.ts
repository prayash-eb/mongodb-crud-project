import { Router } from "express";
import {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart
} from "../controllers//cart.controller.js";

import { requireAuthentication } from "../middleware/auth.middleware.js";

const cartRouter = Router();

cartRouter.use(requireAuthentication)

cartRouter.get("/details", getCart);
cartRouter.post("/add", addToCart);
cartRouter.post("/remove", removeFromCart);
cartRouter.post("/update", updateCartItem);
cartRouter.post("/clear", clearCart);

export default cartRouter;
