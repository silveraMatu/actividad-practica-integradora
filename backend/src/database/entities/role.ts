import { Document, model, Schema } from "mongoose";

export interface IRole extends Document{
    name: string,
    description?: string
}

const RoleSchema = new Schema<IRole>({
    name: {type: String, required: true, unique: true, trim: true, lowercase: true},
    description: {type: String}
    },
    {
        timestamps: true
    }
)

export const Role = model<IRole>("Role", RoleSchema)