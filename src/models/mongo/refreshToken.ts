import mongoose, { Document } from "mongoose";
import { UserDocument } from "./user";

const { Schema } = mongoose;

export interface RefreshTokenDocument extends Document {
  refreshToken: string;
  user: UserDocument["_id"];
}

export const refreshTokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { versionKey: false }
);

refreshTokenSchema.statics.findWithUser = function (refreshToken: string) {
  return this.find({ refreshToken }).populate("user").exec();
};

export const RefreshTokenModel = mongoose.model<RefreshTokenDocument>(
  "RefreshToken",
  refreshTokenSchema
);
