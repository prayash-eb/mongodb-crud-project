import mongoose, { Document, model, Schema, Types } from "mongoose";
import Product from "./product.model.js";

export interface IProductReview extends Document {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    ratingScore: number;
    comment?: string;
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const productReviewSchema = new Schema<IProductReview>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    ratingScore: {
        type: Number,
        required: true
    },
    comment: String,
}, {
    timestamps: true
})

productReviewSchema.post("save", async function (doc) {
    const productId = doc.productId;
    const product = await Product.findById(productId);
    if (!product) return;
    product.totalReviews = (product.totalReviews || 0) + 1;
    product.averageRating = ((product.averageRating || 0) * (product.totalReviews - 1) + doc.ratingScore) / product.totalReviews;
    await product.save();
});

productReviewSchema.post("deleteOne", async function (doc) {
    const productId = doc.productId;
    const product = await Product.findById(productId);
    if (!product) return;

    // Decrease totalReviews count
    product.totalReviews = Math.max(0, (product.totalReviews || 0) - 1);

    // Recalculate averageRating
    const reviews = await ProductReview.find({ productId: product._id });
    const totalRating = reviews.reduce((sum, review) => sum + review.ratingScore, 0);
    product.averageRating = reviews.length ? totalRating / reviews.length : 0;

    await product.save();
});


const ProductReview = model<IProductReview>("Product_Review", productReviewSchema);

export default ProductReview;