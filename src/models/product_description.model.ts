import { Document, model, Schema, Types, type Date } from "mongoose";

export interface IProductDescription extends Document {
    productId: Types.ObjectId;
    longDescription: string;
    // allows to store arbitary key:value pairs
    specifications?: Record<string, any>[];
    warrantyPeriodInYears?: number;
    warrantyDetails?: string;
    returnPolicy?: string;
    createdAt: Date;
    updatedAt: Date;
}

const prodouctDescriptionSchema = new Schema<IProductDescription>({
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    specifications: {
        type: [Schema.Types.Mixed], // allows to store array of key:value pairs
        default: []
    },
    warrantyPeriodInYears: Number,
    warrantyDetails: String,
    returnPolicy: String
}, { timestamps: true });


const ProductDescription = model<IProductDescription>("Product_Description", prodouctDescriptionSchema);

export default ProductDescription;