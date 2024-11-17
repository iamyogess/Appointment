import UserModel from "../models/User.js";
import JWT from "jsonwebtoken";

const isUser = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = JWT.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(id).select("-password");
      
      if (!req.user) {
        let err = new Error("User not found!");
        err.statusCode = 404;
        return next(err);
      }
      next();
    } catch (error) {
      let err = new Error("Not authorized, token failed!");
      err.statusCode = 401;
      next(err);
    }
  } else {
    let error = new Error("Not authorized, no token provided!");
    error.statusCode = 401;
    next(error);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  } else {
    let err = new Error("Not authorized as admin!");
    err.statusCode = 401;
    next(err);
  }
};

const isGuide = (req, res, next) => {
  if (req.user && req.user.guide) {
    return next();
  } else {
    let err = new Error("Not authorized as guide!");
    err.statusCode = 401;
    next(err);
  }
};

export { isAdmin, isUser, isGuide };
