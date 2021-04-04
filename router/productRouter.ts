import express, { Request, Response, NextFunction } from "express";
import { IProduct, Product, Category } from "../models";

const jsonParser = express.json();
const productRouter = express.Router();

/**Send all products that stored in the database */
productRouter.get("/", async (req: Request, res: Response) => {
  try {
    const product: IProduct = await Product.find();
    if (product === null) {
      res.status(404).json({ message: "records not found" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * add new product
 * @param {Object} jsonParser - The object help the middleware in dealing with JSON objects
 */
productRouter.post(
  "/",
  jsonParser,
  async (req: Request, res: Response) => {
    const category = await Category.findById(req.body.categoryId);
    if (category === null) {
      res.status(404).json({ message: "The Category cannot found" });
    } else if (isCodeFormatValid(req.body.code) === false) {
      res.status(406).json({ message: "The code format is wrong" });
    } else {
      const product = new Product({
        ...req.body,
      });
      try {
        const newCategory = await product.save();
        res.status(201).send("Success " + newCategory);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
);

/** Return a product based on the sent id */
productRouter.get(
  "/:id",
  getProduct,
  async (req: Request, res: ProductResponse) => {
    res.json(res.product);
  }
);

/** Delete record from products collection based on the sent id */
productRouter.delete(
  "/:id",
  getProduct,
  async (req: Request, res: ProductResponse) => {
    try {
      await Product.remove(res.product);
      res.send("The Record deleted Successfully");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * Update record in products collection based on the sent id
 * @param {Function} getProduct - Function middleware get the specific product if found and edit the response object in adding the found product on it
 * @param {Object} jsonParser - The object help the middleware in dealing with JSON objects
 */
productRouter.patch(
  "/:id",
  getProduct,
  jsonParser,
  async (req: Request, res: ProductResponse) => {
    if (res.product !== undefined && req.body !== undefined) {
      const arrayOfKeys = Object.keys(req.body);
      arrayOfKeys.forEach(async (key) => {
        if (res.product !== undefined) {
          if (key === "code") {
            if (!isCodeFormatValid(req.body[key])) {
              res.status(406).json({ message: "The code is wrong" });
            }
          }
          if (key === "categoryId") {
            const category = await Category.findById(req.body[key]);
            if (category === null) {
              res.status(404).json({ message: "The Category cannot found" });
            }
          }
          res.product.set(key, req.body[key]);
        }
      });
      try {
        const updatedProduct = await res.product.save();
        res.json(updatedProduct);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
);

interface ProductResponse extends Response {
  product?: IProduct;
}

/**
 * Middleware help in finding the required category and return it if it found
 * @param {Callback} next -Call the next middleware in the stack to handle the next request
 */
async function getProduct(
  req: Request,
  res: ProductResponse,
  next: NextFunction
) {
  let product: IProduct;
  try {
    product = await Product.findById(req.params.id);
    if (product === null) {
      return res.status(404).json({ message: "The record cannot found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.product = product;
  next();
}

/**
 * Check if the code used the required format
 * @param {string} code - The code that sent in the body request
 */
const isCodeFormatValid: Function = (code: string): boolean => {
  return /^\w{3,4}(\-)\w{3,4}(\-)\w{3,4}$/.test(code);
};

module.exports = productRouter;
