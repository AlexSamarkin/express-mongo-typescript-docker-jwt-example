import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface UserDocument extends Document {
  login: string;
  password: string;
  email: string;
}

export const UserSchema = new Schema(
  {
    login: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { versionKey: false }
);

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
