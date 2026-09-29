import mongoose, {Schema, Document } from "mongoose";

export interface iUser extends Document {
    name: string,
    email: string,
    password: string,
    roleId: string
}

const UserSchema: Schema = new Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        roleId: {type: String, required: true},
    },        
    {
            timestamps: true
    }
)

export const Usar = mongoose.model<iUser>("User", UserSchema)