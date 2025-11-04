import { type Request, type Response, type NextFunction, json } from "express";
import Product, { type IProduct } from "../models/product.model.js";
import ProductCategory, { type IProductCategory } from "../models/category.model.js";
import ProductDescription, { type IProductDescription } from "../models/product_description.model.js";
import ProductVariant, { type IProductVariant } from "../models/product_variant.model.js";


export const addProductCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryData = req.body as IProductCategory;
        const newCategory = await ProductCategory.create({
            ...categoryData
        })
        return res.status(201).json({ success: true, newCategory })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}


export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productData = req.body as IProduct;
        const newProduct = await Product.create({
            ...productData
        })

        return res.status(201).json({ success: true, newProduct })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}

export const addProductDescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productDescriptionData = req.body as IProductDescription;
        const productDescription = await ProductDescription.create({
            ...productDescriptionData
        })
        return res.status(201).json({ success: true, productDescription })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}

export const addProductVariant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productVariantData = req.body as IProductVariant;
        const productVariant = await ProductVariant.create({
            ...productVariantData
        })
        return res.status(201).json({ success: true, productVariant })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}

export const removeProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        await Promise.all([
            ProductDescription.deleteMany({ productId: product._id }),
            ProductVariant.deleteMany({ productId: product._id }),
            Product.findByIdAndDelete(product._id)
        ])

        return res.status(201).json({ success: true })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}
