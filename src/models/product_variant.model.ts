import { Document, model, Schema, Types, type Date } from "mongoose";
import Product from "./product.model.js";

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


/** 
 * When a new variant is created 
 */
productVariantSchema.post("save", async function (doc, next) {
    try {
        // Always increment when variant is newly created
        await Product.findByIdAndUpdate(doc.productId, {
            $inc: { totalStockCount: doc.stockCount }
        });
        next();
    } catch (error: any) {
        console.error("Error updating totalStock on save:", error);
        next(error);
    }
});

/**
 * Handle stock count change via findOneAndUpdate
 */
productVariantSchema.pre("findOneAndUpdate", async function (next) {
    // Save the old document before update
    const docToUpdate = await this.model.findOne(this.getQuery());
    (this as any)._oldStock = docToUpdate?.stockCount || 0;
    (this as any)._productId = docToUpdate?.productId;
    next();
});

productVariantSchema.post("findOneAndUpdate", async function (doc, next) {
    try {
        if (!doc) return next();

        const oldStock = (this as any)._oldStock;
        const newStock = doc.stockCount;
        const diff = newStock - oldStock;

        if (diff !== 0) {
            await Product.findByIdAndUpdate((this as any)._productId, {
                $inc: { totalStockCount: diff },
            });
        }

        next();
    } catch (error) {
        console.error("Error updating totalStock after update:", error);
    }
});

/**
 * When a variant is deleted
 */
productVariantSchema.post("findOneAndDelete", async function (doc, next) {
    try {
        if (doc?.productId && doc?.stockCount) {
            await Product.findByIdAndUpdate(doc.productId, {
                $inc: { totalStockCount: -doc.stockCount },
            });
        }
        next();
    } catch (error) {
        console.error("Error updating totalStock after delete:", error);
    }
});


productVariantSchema.index({ productId: 1 });

const ProductVariant = model<IProductVariant>("Product_Variant", productVariantSchema)
export default ProductVariant