import express, { Request, Response, NextFunction } from "express";
import { IUser, User } from "../models";

const userRouter = express.Router();
const jsonParser = express.json();

/**Send all users that stored in the database */
userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const user: IUser = await User.find();
    if (user === null) {
      res.status(404).json({ message: "user not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * add new user
 * @param {Object} jsonParser - The object help the middleware in dealing with JSON objects
 */
userRouter.post("/", jsonParser, async (req: Request, res: Response) => {
  const user = new User({
    ...req.body,
  });
  try {
    if(checkValidationPassword(user.password)){
        const newUser = await user.save();
        res.status(201).send("Success " + newUser);
    }else{
        res.status(400).json({ message: "The password should contains at least 4 characters and 1 digit" });
    }
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

interface UserResponse extends Response {
    user?: IUser;
}

/** Return a category based on the sent id */
userRouter.get(
    "/:id",
    getUser,
    async (req: Request, res: UserResponse) => {
      res.json(res.user);
    }
);


const checkValidationPassword = (str: String): boolean => {
  return (
    str.replace(/[^a-zA-Z]/g, "").length >= 4 &&
    str.replace(/[^0-9]/g, "").length >= 1
  );
};

/**
* Middleware help in finding the required category and return it if it found
* @param {Callback} next -Call the next middleware in the stack to handle the next request
*/
async function getUser(
    req: Request,
    res: UserResponse,
    next: NextFunction
  ) {
    let user: IUser;
    try {
      user = await User.findById(req.params.id);
      if (user == null) {
        return res.status(404).json({ message: "Cannot find the user" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    res.user = user;
    next();
}



module.exports = userRouter;
