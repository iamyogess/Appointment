import UserModel from "../models/User.js";
import uploadPicture from "./../middlewares/uploadPictureMIddleware.js";

const registerUser = async (req, res, next) => {
  try {
    const { name, email, phoneNo, password, otp } = req.body;

    if (!name || !password || (!email && !phoneNo)) {
      return res
        .status(400)
        .json({ message: "All fields are required! Fill the form correctly!" });
    }

    let user;

    if (email) {
      user = await UserModel.findOne({ email });
    } else if (phoneNo) {
      user = await UserModel.findOne({ phoneNo });
    }

    if (user) {
      return res.status(400).json({
        message: "User already exists with the provided email or phone number.",
      });
    }

    const newUser = new UserModel({
      name,
      email: email || null,
      phoneNo: phoneNo || null,
      password,
      otp,
    });

    let token = await newUser.generateJWT();

    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: "User registered!", user: savedUser, token: token });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { phoneNo, email, password, otp } = req.body;
    if ((!phoneNo && !email) || !password) {
      res.status(400).json({ message: "All fields must be provided!" });
    }

    let user;
    if (email) {
      user = await UserModel.findOne({ email });
    } else if (phoneNo) {
      user = await UserModel.findOne({ phoneNo });
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email or password not found!" });
    }

    if (user.comparePassword(password)) {
      return res.status(201).json({
        message: "User logged in!",
        _id: user.id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        verified: user.verified,
        token: await user.generateJWT(),
      });
    }
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    let user = await UserModel.findOne({ _id: req.user._id });
    if (!user) {
      let err = new Error("User not found!");
      err.statusCode = 404;
      return next(err);
    }

    const token = await user.generateJWT();

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email ? user.email : user.phoneNo,
      profilePicture: user.profilePicture,
      verified: user.verified,
      admin: user.admin,
      guide: user.guide,
      isUser: user.isUser,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

const updatedProfileDetails = async (req, res, next) => {
  try {
    let user = await UserModel.findOne({ _id: req.user._id });

    if (!user) {
      let err = new Error("User not found!");
      err.statusCode = 404;
      throw err;
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNo = req.body.phoneNo || user.phoneNo;

    if (req.body.password) {
      if (req.body.password.length < 6) {
        let err = new Error("Password length must be at least 6 characters.");
        err.statusCode = 400; // Bad request status code
        throw err;
      }
      user.password = req.body.password;
    }

    const updatedProfileDetails = await user.save();
    const token = await user.generateJWT();

    return res.status(200).json({
      message: "Profile updated successfully!",
      _id: updatedProfileDetails._id,
      name: updatedProfileDetails.name,
      email: updatedProfileDetails.email
        ? updatedProfileDetails.email
        : updatedProfileDetails.phoneNo,
      verified: updatedProfileDetails.verified,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

const uploadProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");

    upload(req, res, async function (err) {
      if (err) {
        throw new Error(
          "An unknown error ocurred when uploading " + err.message
        );
      } else {
        if (req.file) {
          let filename;
          let updatedUser = await UserModel.findById(req.user._id);
          filename = updatedUser.avatar;
          if (filename) {
            fileRemover(filename);
          }

          updatedUser.avatar = req.file.filename;
          await updatedUser.save();

          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        } else {
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();
          fileRemover(filename);
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const requestGuidePermission = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    if (user.guide) {
      res.status(404).json({ message: "You are already a guide!" });
    }

    user.verified = false;
    user.guide = true;
    await user.save();

    return res
      .status(200)
      .json({ message: "Guide request submitted successfully." });
  } catch (error) {
    next(error);
  }
};

const grantGuidePermission = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    user.verified = true;
    user.guide = true;
    await user.save();

    return res.status(200).json({ message: "Guide approved successfully!" });
  } catch (error) {
    next(error);
  }
};

const revokeGuidePermission = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    user.verified = false;
    user.guide = false;

    user.save();

    return res
      .status(200)
      .json({ message: "Guide status revoked successfully!" });
  } catch (error) {
    next(error);
  }
};

const getRequestedGuides = async (req, res, next) => {
  try {
    const requestedGuides = await UserModel.find({
      guide: true,
      verified: false,
    });
    return res.status(200).json({
      message: "Requested guides retrieved successfully.",
      requestedGuides,
    });
  } catch (error) {
    next(error);
  }
};

const getApprovedGuides = async (req, res, next) => {
  try {
    const approvedGuides = await UserModel.find({
      guide: true,
      verified: true,
    });
    return res.status(200).json({
      message: "Approved guides retrieved successfully.",
      approvedGuides,
    });
  } catch (error) {
    next(error);
  }
};


const uploadUserDocuments = async (req, res, next) => {};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updatedProfileDetails,
  uploadProfilePicture,
  requestGuidePermission,
  grantGuidePermission,
  revokeGuidePermission,
  getRequestedGuides,
  getApprovedGuides,
};
