import { Document, Schema, Model, model } from "mongoose";

export interface ICategory extends Document {
  id: number;
  name: string;
}

export const CategorySchema: Schema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
});

const Category: Model<ICategory> = model<ICategory>("Category", CategorySchema);
module.exports = Category
