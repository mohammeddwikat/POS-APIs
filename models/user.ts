import { Schema, Document, Model, model } from "mongoose"

export interface IUser extends Document {
  password: string;
  email: string;
 
}

export const UserSchema: Schema = new Schema({
    password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
 
});

const User: Model<IUser> = model<IUser>("User", UserSchema);
module.exports = User


