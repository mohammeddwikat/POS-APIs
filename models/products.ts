import { Schema, Document, Model, model  } from "mongoose";


export interface IProduct extends Document {
  id: number;
  name: string;
  rawPrice: number;
  price: number;
  code: string;
  color: string;
  description: string;
  stockCount: number;
  expirationDate: Date;
  categoryId: number;
}

const ProductSchema: Schema = new Schema({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  rawPrice: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    minimum: 10,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String,
    optional: true,
  },
  description: {
    type: String,
    optional: true,
  },
  stockCount: {
    type: Number,
    optional: true,
  },
  expirationDate: {
    type: Date,
    optional: true,
  },
  categoryId: {
    required: true,
    type: String
  },
});

const Product: Model<IProduct> = model<IProduct>("Product", ProductSchema);
module.exports = Product
