import { Document, model, Schema, Types } from "mongoose";

export interface IProductCategory extends Document {
    name: string;
    description: string;
    parentCategoryId: Types.ObjectId;
    categoryPath: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
}

const productCategorySchema = new Schema<IProductCategory>({
    name: {
        type: String,
        required: true
    },
    description: String,
    parentCategoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    categoryPath: {
        type: String,
        trim: true,
        lowercase: true
    },
    level: Number
}, {
    timestamps: true
})

productCategorySchema.index({ parentCategoryId: 1 })

const ProductCategory = model<IProductCategory>("Product_Category", productCategorySchema)

export default ProductCategory