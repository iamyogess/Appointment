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
      req.user = await UserModel.findById({ id }).select("-password");
      next();
    } catch (error) {
      let err = new Error("Not authorized!, token failed!");
      err.statusCode = 401;
      next(err);
    }
  } else {
    let error = new Error("Not authorized!, No token!");
    error.statusCode = 401;
    next(error);
  }
};

const isAdmin = () => {
  if (req.user && req.user.admin) {
    next();
  } else {
    let err = new Error("Not authorized as admin!");
    err.statusCode = 401;
    next(err);
  }
};
const isGuide = () => {
  if (req.user && req.user.guide) {
    next();
  } else {
    let err = new Error("Not authorized as guide!");
    err.statusCode = 401;
    next(err);
  }
};

export { isAdmin, isUser, isGuide };
