import mongoose, { Schema, Document, Model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface User extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
}

type UserModel = Model<User, {}, {}>

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.plugin(uniqueValidator);

export const getUserModel = (connection: mongoose.Connection) => {
  return connection.model<User, UserModel>("User", userSchema);
};
