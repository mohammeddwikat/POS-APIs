import express, { Request, Response, NextFunction } from "express";
import { ICheckout, Checkout } from "../models";
import { Guid } from "js-guid";

const jsonParser = express.json();
const checkoutRouter = express.Router();

/**Send all checkouts that stored in the database */
checkoutRouter.get("/", async (req: Request, res: Response) => {
  try {
    const checkout: ICheckout = await Checkout.find();
    if (checkout === null) {
      res.status(404).json({ message: "records not found" });
    } else {
      res.status(200).json(checkout);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * add new checkout
 * @param {Object} jsonParser - The object help the middleware in dealing with JSON objects
 */
checkoutRouter.post(
  "/",
  jsonParser,
  async (req: Request, res: Response) => {
    const checkout = new Checkout({
      ...req.body,
      id: Guid.newGuid(),
    });
    try {
      const newCheckout = await checkout.save();
      res.status(201).send("Success " + newCheckout);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = checkoutRouter