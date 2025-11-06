import type { Request, Response, NextFunction } from "express";
import User, { type IUser, type IUserAddress } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

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

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
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

export const removeAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { addressId } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { addresses: { _id: addressId } } },
            { new: true } // return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found or error while updating addresses" });
        }

        return res.status(200).json({
            success: true,
            addresses: updatedUser.addresses
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id!;
        const user = await User.findById(userId)
        return res.status(200).json({
            success: true,
            addresses: user?.addresses
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user?.id!);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phoneNo } = req.body;
        const user = await User.findById(req.user?.id!);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
            user.isEmailVerified = false;
        }
        if (phoneNo) {
            user.phoneNo = phoneNo
        }
        await user.save();

        res.status(200).json({ success: true, user })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}
