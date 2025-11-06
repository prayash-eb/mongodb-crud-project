import { Document, model, Schema, Types } from "mongoose";

interface IUserCartItems {
    productId: Types.ObjectId;
    quantity: number;
    addedAt?: Date
}

interface IUserCart extends Document {
    userId: Types.ObjectId;
    items: IUserCartItems[]
    totalItems: number;
    createdAt: Date,
    updatedAt: Date
}

const userCartItemsSchema = new Schema<IUserCartItems>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: Number,
    addedAt: {

        type: Date,
        default: Date.now
    }
}, { _id: false })

const userCartSchema = new Schema<IUserCart>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: {
        type: [userCartItemsSchema],
        required: true
    },
    totalItems: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

userCartSchema.index({ userId: 1 })

const Cart = model<IUserCart>("Cart", userCartSchema)
export default Cart;