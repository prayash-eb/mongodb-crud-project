import { Document, model, Schema, Types } from "mongoose";

interface IOrderItems {
    productId: Types.ObjectId;
    unitPriceAtPurchase: number;
    unitPriceAfterDiscount: number;
    discountAtPurchase?: number;
    quantity: number;
}

interface IOrderShippingAddress {
    label: string,
    city: string;
    state: string;
    country: string;
    postalCode: string

}
export interface IUserOrder extends Document {
    userId: Types.ObjectId;
    items: IOrderItems[];
    totalAmount: number;
    deliveredDate?: Date;
    status: string;
    shippingAddress: IOrderShippingAddress;
    createdAt: Date;
    updatedAt: Date;
}

const orderItemsSchema = new Schema<IOrderItems>({
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    unitPriceAtPurchase: {
        type: Number,
        required: true
    },
    discountAtPurchase: {
        type: Number,
        default: 0
    },
    unitPriceAfterDiscount: {
        type: Number
    },
    quantity: {
        type: Number,
        default: 1
    }
})

const orderSchema = new Schema<IUserOrder>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: {
        type: [orderItemsSchema],
        required: true
    },
    totalAmount: Schema.Types.Double,
    deliveredDate: Schema.Types.Date,
    status: {
        type: String,
        enum: ["Pending", "Delivered", "Canceled"],
        default: "Pending"
    },
    shippingAddress: {
        label: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    }
}, {
    timestamps: true
})

const Order = model<IUserOrder>("Order", orderSchema)
export default Order