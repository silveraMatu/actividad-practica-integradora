import { Document, model, Schema } from "mongoose";

export enum allowedRoles {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  USER = 'user',
}

export interface IRole extends Document{
    name: string,
}

const RoleSchema = new Schema<IRole>({
    name: {type: String, enum: Object.values(allowedRoles), required: true, unique: true, trim: true, lowercase: true},
    },
    {
        timestamps: true
    }
)

export const Role = model<IRole>("Role", RoleSchema)
