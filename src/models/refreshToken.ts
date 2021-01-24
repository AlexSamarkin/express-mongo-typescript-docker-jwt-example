import mongoose from "mongoose";
import { UserSchema } from "./user";

const { Schema } = mongoose;

export const refreshTokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    user: {
      type: UserSchema,
    },
  },
  { versionKey: false }
);

export const RefreshTokenModel = mongoose.model(
  "RefreshToken",
  refreshTokenSchema
);
