import mongoose, { Document, model, Schema, Types } from "mongoose";

export interface IUserReview {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    ratingScore: number;
    comment?: string;
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const userReviewSchema = new Schema<IUserReview>({
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

const UserReview = model<IUserReview>("User_Review", userReviewSchema);

export default UserReview;