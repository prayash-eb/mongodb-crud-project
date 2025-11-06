import type { Request, Response, NextFunction } from "express";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import type { Types } from "mongoose";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });

        const { items, shippingAddress } = req.body;

        if (!items || !items.length)
            return res.status(400).json({ success: false, message: "No items provided" });

        // Fetch all product IDs from DB
        const productIds = items.map((item: any) => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length)
            return res.status(404).json({ success: false, message: "One or more products not found" });

        // Recalculate total based on current product data
        let totalAmount = 0;
        const updatedItems = items.map((item: any) => {
            const product = products.find(p => (p._id as Types.ObjectId).equals(item.productId));
            if (!product) throw new Error("Product not found");

            const unitPrice = product.price;
            const discount = product.discountPercentage || 0;

            const unitPriceAfterDiscount = unitPrice - (unitPrice * discount) / 100;
            const subtotal = unitPriceAfterDiscount * item.quantity;

            totalAmount += subtotal;

            return {
                productId: product._id,
                unitPriceAtPurchase: unitPrice,
                unitPriceAfterDiscount: unitPriceAfterDiscount,
                discountAtPurchase: discount,
                quantity: item.quantity,
            };
        });

        // Create order
        const newOrder = new Order({
            userId,
            items: updatedItems,
            totalAmount,
            shippingAddress,
        });

        await newOrder.save();

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: newOrder,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to create order" });
    }
};


export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Extract filters from query params
        const { status, startDate, endDate } = req.query;

        // Base query for current user
        const query: any = { userId };

        // Optional: filter by order status
        if (status && typeof status === "string") {
            query.status = status;
        }

        // Optional: filter by createdAt date range
        if (startDate || endDate) {
            console.log(startDate, endDate);
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate as string);
            if (endDate) query.createdAt.$lte = new Date(endDate as string);
        }

        const orders = await Order.find(query)
            .populate("items.productId", "name price images")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            filters: {
                status: status || "all",
                startDate: startDate || null,
                endDate: endDate || null,
            },
            orders,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};


export const confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                status: "Delivered",
                deliveredDate: new Date(),
            },
            { new: true }
        );

        if (!updatedOrder)
            return res.status(404).json({ success: false, message: "Order not found" });

        return res.status(200).json({
            success: true,
            message: "Order confirmed successfully",
            order: updatedOrder,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to confirm order" });
    }
};


export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const userId = req.user?.id;

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order)
            return res.status(404).json({ success: false, message: "Order not found" });

        if (order.status === "Delivered")
            return res.status(400).json({ success: false, message: "Delivered orders cannot be canceled" });

        order.status = "Canceled";
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order canceled successfully",
            orderId
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to cancel order" });
    }
};
