import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserAddress {
    location: {
        type: "Point",
        coordinates: [number, number]
    },
    label: string;
    state: string;
    city: string;
    country: string;
    postalCode?: string;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phoneNo?: string;
    isEmailVerified: boolean;
    addresses: IUserAddress[]
    createdAt: Date
    updatedAt: Date
}


const userAddressSchema = new Schema<IUserAddress>({
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: (val: number[]) => val.length === 2,
                message: "Coordinates must be [longitude, latitude]"
            }
        }
    },
    label: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    postalCode: { type: String, trim: true },
}
)

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // create an index
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    addresses: [userAddressSchema],
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc: IUser, ret: any) {
            delete ret.password;
            delete ret.__v;
        },
    },
})


userSchema.index({ "addresses.location": "2dsphere" });


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


const User = model<IUser>("User", userSchema)

export default User