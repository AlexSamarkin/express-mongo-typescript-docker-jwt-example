import mongoose from "mongoose";

const { Schema } = mongoose;

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
  },
  { versionKey: false }
);

export const UserModel = mongoose.model("User", UserSchema);
