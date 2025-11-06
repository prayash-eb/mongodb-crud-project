import mongoose, { Document, model, Schema, Types } from "mongoose";

interface IProductReview {
    userId: Types.ObjectId,
    reviewId: Types.ObjectId,
    ratingScore: number;
    comment: string;
    createdAt: Date;
}

export interface IProduct extends Document {
    name: string;
    categoryId: Types.ObjectId;
    price: number,
    brand: string;
    discountPercentage?: number;
    thumbnail: string;
    shortDescription?: string;
    descriptionId: Types.ObjectId;
    variants: Types.ObjectId[];
    totalReviews: number;
    averageRating: number;
    totalStockCount: number;
    recentReviews: IProductReview[]
    createdAt: Date;
    updatedAt: Date;
}

const recentReviewSchema = new Schema<IProductReview>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    reviewId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product_Review"
    },
    ratingScore: {
        type: Number,
        required: true
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    price: {
        type: Number,
        required: true
    },
    descriptionId: {
        type: Schema.Types.ObjectId,
        ref: "Product_Description"
    },
    variants: [{ type: Schema.Types.ObjectId, ref: "Product_Variant" }],
    brand: String,
    discountPercentage: Number,
    thumbnail: String,
    shortDescription: String,
    totalReviews: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalStockCount: {
        type: Number,
        default: 0
    },
    recentReviews: {
        type: [recentReviewSchema],
        default: []
    }

}, {
    timestamps: true
})


const Product = model<IProduct>("Product", productSchema)

export default Product