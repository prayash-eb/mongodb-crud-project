import type { Request, Response, NextFunction } from "express";
import User, { type IUser, type IUserAddress } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import UserCart from "../models/cart.model.js";
import type { IUserReview } from "../models/review.model.js";
import UserReview from "../models/review.model.js";

export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body as IUser;
        const userAlreadyExist = await User.findOne({
            email: userData.email
        })
        if (userAlreadyExist) {
            return res.status(409).json({ message: "User already exist" })
        }
        const newUser = await User.create(userData)
        return res.status(201).json({ success: true, user: newUser })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userLoginData: { email: string, password: string } = req.body;
        const userExist = await User.findOne({
            email: userLoginData.email
        })
        if (!userExist) {
            return res.status(404).json({ message: "Invalid Credentials" });
        }
        const isPasswordMatched = await bcrypt.compare(userLoginData.password, userExist.password)
        if (!isPasswordMatched) {
            return res.status(404).json({ message: " Invalid Credentials" });
        }
        const tokenPayload = {
            id: userExist._id.toString(),
            email: userLoginData.email
        }
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!)
        return res.status(201).json({ success: true, token })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}


export const addUserAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userAddressData = req.body as IUserAddress;
        const newUser = await User.findByIdAndUpdate(req.user?.id, {
            $push: {
                addresses: userAddressData
            }
        }, { new: true })
        return res.json({ success: true, user: newUser })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}


export const addUserCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { productId, quantity } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than 0" });
        }

        // find the user's cart
        let cart = await UserCart.findOne({ userId });

        if (!cart) {
            // create a new cart
            cart = new UserCart({
                userId,
                items: [{ productId, quantity }]
            });
        } else {
            // check if product already exists in cart
            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId
            );

            if (existingItem) {
                // increment quantity
                existingItem.quantity += quantity;
            } else {
                // add as new item
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const addUserReview = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const reviewData = req.body as IUserReview
        const review = await UserReview.create({
            ...reviewData
        })
        return res.json({ success: true, review })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}
