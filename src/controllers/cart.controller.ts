import type { Request, Response, NextFunction } from "express";
import Cart from "../models/cart.model.js";
import { Types } from "mongoose";


// Add product to cart
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { productId, quantity } = req.body;

        if (!Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid productId" });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex]!.quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        return res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// Remove product from cart
export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// Update quantity of a product in cart
export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) return res.status(404).json({ success: false, message: "Item not in cart" });

        item.quantity = quantity;
        await cart.save();

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// Clear entire cart
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = [];
        await cart.save();

        return res.status(200).json({ success: true, message: "Cart cleared successfully", cart });
    } catch (error) {
        next(error);
    }
};

// Get user's cart
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        let cart = await Cart.findOne({ userId }).populate("items.productId", "name price images");
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: []
            })
        }
        return res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};
