import { Document, model, Schema, Types, type Date } from "mongoose";

export interface IProductVariant extends Document {
    productId: Types.ObjectId;
    color?: string;
    size?: string;
    price: number;
    stockCount: number;
    images?: string[];
    createdAt: Date,
    updatedAt: Date
}

const productVariantSchema = new Schema<IProductVariant>({
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    color: String,
    size: String,
    price: Number,
    stockCount: Number,
    images: {
        type: [String],
        default: []
    },
}, {
    timestamps: true
})

productVariantSchema.post("save", async ()=> {
    
})


productVariantSchema.index({ productId: 1 });

const ProductVariant = model<IProductVariant>("Product_Variant", productVariantSchema)
export default ProductVariant