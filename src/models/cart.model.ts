import { Document, model, Schema, Types } from "mongoose";

interface IUserCartItems {
    productId: Types.ObjectId;
    quantity: number;
    addedAt?: Date
}

interface IUserCart extends Document {
    userId: Types.ObjectId;
    items: IUserCartItems[]
    createdAt: Date,
    updatedAt: Date
}

const userCartItemsSchema = new Schema<IUserCartItems>({
    productId: Types.ObjectId,
    quantity: Number,
    addedAt: {
        type: Date,
        default: Date.now
    }
})

const userCartSchema = new Schema<IUserCart>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    items: {
        type: [userCartItemsSchema],
        required: true
    }
}, {
    timestamps: true
})

userCartSchema.index({ userId: 1 })

const UserCart = model<IUserCart>("User_Cart", userCartSchema)
export default UserCart;