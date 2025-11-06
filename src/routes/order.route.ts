import express from "express";
import {
    createOrder,
    getOrders,
    confirmOrder,
    cancelOrder,
} from "../controllers/order.controller.js";
import { requireAuthentication } from "../middleware/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/", requireAuthentication, createOrder);
orderRouter.get("/", requireAuthentication, getOrders);
orderRouter.patch("/confirm/:orderId", requireAuthentication, confirmOrder);
orderRouter.patch("/cancel/:orderId", requireAuthentication, cancelOrder);

export default orderRouter;
