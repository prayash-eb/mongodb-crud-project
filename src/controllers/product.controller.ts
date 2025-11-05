import { type Request, type Response, type NextFunction, json } from "express";
import Product, { type IProduct } from "../models/product.model.js";
import ProductDescription, { type IProductDescription } from "../models/product_description.model.js";
import ProductVariant, { type IProductVariant } from "../models/product_variant.model.js";
import type { IProductReview } from "../models/review.model.js";
import ProductReview from "../models/review.model.js";
import type { Types } from "mongoose";


export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get page & limit from query params, with defaults
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // Calculate skip value
        const skip = (page - 1) * limit;

        // Fetch paginated products
        const products = await Product.find({})
            .skip(skip)
            .limit(limit)
            .lean();

        // Count total documents for pagination info
        const total = await Product.countDocuments();

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
            products,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}
export const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;

        // Find product by ID
        const product = await Product.findById(productId).populate("descriptionId").populate("variants.");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
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
export const editProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const productData = req.body as IProduct;
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            ...productData
        }, {
            new: true,
            upsert: true,
            runValidators: true
        })
        return res.json({
            success: true, updatedProduct

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
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
            ProductReview.deleteMany({ productId: product._id }),
            Product.findByIdAndDelete(product._id)
        ])

        return res.status(201).json({ success: true })
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
        await Product.findByIdAndUpdate(productDescriptionData.productId, {
            $set: {
                descriptionId: productDescription._id
            }
        })
        return res.status(201).json({ success: true, productDescription })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}
export const getProductDescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const productDescription = await ProductDescription.findOne({
            productId
        })
        return res.json({ success: true, productDescription })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
}
export const deleteProductDescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        const deletedDescription = await ProductDescription.findOneAndDelete({
            productId
        })
        if (!deletedDescription) {
            res.status(404).json({ message: "Description not found or error while deletinf description" })
        }
        await Product.findByIdAndUpdate(productId, {
            $unset: {
                descriptionId: ""
            }
        })
        return res.status(201).json({ success: true, deletedId: productId })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}
export const editProductDescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const productDescriptionData = req.body as IProductDescription;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        const productDescription = await ProductDescription.findOneAndUpdate({
            productId
        }, {
            ...productDescriptionData
        }, {
            upsert: true,
            new: true,
            runValidators: true
        })

        return res.status(200).json({ success: true, productDescription })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}


export const addProductVariant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productVariantData = req.body as IProductVariant;
        const productVariant = await ProductVariant.create({
            ...productVariantData
        })
        await Product.findByIdAndUpdate(productVariantData.productId, {
            $push: {
                variants: productVariant._id
            }
        })
        return res.status(201).json({ success: true, productVariant })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}
export const getProductVariants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const variants = await Product.findById(productId).populate("variants").select({ variants: 1 })
        return res.status(200).json({ success: true, variants })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}
export const updateProductVariants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params
        const productVariantData = req.body as IProductVariant
        const updatedVariant = await ProductVariant.findOneAndUpdate({
            productId
        }, {
            ...productVariantData
        })

        return res.json({
            success: true,
            updatedVariant
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}
export const deleteProductVariant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const { variantId } = req.body;

        // Delete the variant first
        const deletedVariant = await ProductVariant.findOneAndDelete({
            _id: variantId,
            productId
        });

        if (!deletedVariant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found or already deleted"
            });
        }

        //  Update the product only if variant deletion succeeded
        await Product.findByIdAndUpdate(productId, {
            $pull: { variants: variantId }
        });


        return res.status(200).json({
            success: true,
            message: "Variant deleted successfully"
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message || "Something went wrong"
        });
    }
}


export const addProductReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewData = req.body as IProductReview;

        // 1. Create the review
        const review = await ProductReview.create({ ...reviewData });

        // 2. Add review to product's topReviews array
        const product = await Product.findById(reviewData.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Push the new review to the beginning (most recent first)
        const topReviews = product.recentReviews || [];

        const newReview = {
            userId: review.userId,
            reviewId: review._id as Types.ObjectId,
            ratingScore: review.ratingScore,
            comment: review.comment ? review.comment : "",
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        }

        topReviews.unshift(newReview);

        // Keep only the 3 most recent reviews
        if (topReviews.length > 3) {
            // Sort by createdAt descending and take the first 3
            topReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            topReviews.splice(3);
        }

        // Update the product
        product.recentReviews = topReviews;
        await product.save();

        return res.json({ success: true, review });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error });
    }
}
export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const reviews = await ProductReview.find({ productId })
        return res.json({ success: true, reviews });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error });
    }
}
export const deleteProductReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { reviewId } = req.params;

        const deletedReview = await ProductReview.findOneAndDelete({ _id: reviewId, userId });
        if (!deletedReview) {
            return res.status(404).json({ success: false, message: "Review not found or unauthorized" });
        }

        await Product.findOneAndUpdate(
            { "recentReviews.reviewId": reviewId },
            { $pull: { recentReviews: { reviewId } } }
        );
        return res.json({ success: true, deleteReviewId: reviewId })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}