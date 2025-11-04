import mongoose, { Document, model, Schema, Types } from "mongoose";

interface IProductReview {
    userId: Types.ObjectId,
    ratingScore: number;
    comment: number;
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
    ratingScore: {
        type: Number,
        required: true
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    _id: false
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