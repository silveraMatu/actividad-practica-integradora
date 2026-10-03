import mongoose, {Schema, Document, Types } from "mongoose";

export interface iUser extends Document {
    _id: Types.ObjectId
    name: string,
    email: string,
    password: string,
    rol: Types.ObjectId
}

const UserSchema: Schema = new Schema(
    {
        name: {type: String, required: true, trim: true},
        email: {type: String, required: true, unique: true, lowercase: true},
        password: {type: String, required: true},
        rol: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true
        }
    },        
    {
        timestamps: true
    }
)

export const User = mongoose.model<iUser>("User", UserSchema)