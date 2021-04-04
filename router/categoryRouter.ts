import express, { Request, Response, NextFunction } from "express";
import { ICategory, Category } from "../models";

const jsonParser = express.json();
const categoryRouter = express.Router();

/**Send all categories that stored in the database */
categoryRouter.get("/", async (req: Request, res: Response) => {
    try {
      const category: ICategory = await Category.find();
      if (category === null) {
        res.status(404).json({ message: "records not found" });
      } else {
        res.status(200).json(category);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  
/**
* add new category 
* @param {Object} jsonParser - The object help the middleware in dealing with JSON objects
*/
categoryRouter.post("/", jsonParser, async (req: Request, res: Response) => {
    const category = new Category({
      id: req.body.id,
      name: req.body.name,
    });
    try {
      const newCategory = await category.save();
      res.status(201).send("Success " + newCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});
  
/** Return a category based on the sent id */
categoryRouter.get(
    "/:id",
    getCategory,
    async (req: Request, res: CategoryResponse) => {
      res.json(res.category);
    }
);
  
/** Delete record from categories collection based on the sent id */
categoryRouter.delete(
    "/:id",
    getCategory,
    async (req: Request, res: CategoryResponse) => {
      try {
        await Category.remove(res.category);
        res.send("The Record deleted Successfully");
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
);
  
/**
* Update record in category collection based on the sent id
* @param {Function} getCategory - Function middleware get the specific category if found and edit the response object in adding the found category on it
* @param {Object} jsonParser - The object help the middleware in dealing with JSON objects
*/
categoryRouter.patch(
    "/:id",
    getCategory,
    jsonParser,
    async (req: Request, res: CategoryResponse) => {
      if (res.category !== undefined && req.body !== undefined) {
        if (req.body.name != null) {
          res.category.name = req.body.name;
          console.log(req.body.name);
        }
        try {
          const updatedCategory = await res.category.save();
          res.json(updatedCategory);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    }
);

interface CategoryResponse extends Response {
    category?: ICategory;
}

/**
* Middleware help in finding the required category and return it if it found
* @param {Callback} next -Call the next middleware in the stack to handle the next request
*/
async function getCategory(
    req: Request,
    res: CategoryResponse,
    next: NextFunction
  ) {
    let category: ICategory;
    try {
      category = await Category.findById(req.params.id);
      if (category == null) {
        return res.status(404).json({ message: "Cannot find the category" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    res.category = category;
    next();
}

module.exports = categoryRouter