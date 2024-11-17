import UserModel from "../models/User.js";

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

    let token = await user.generateJWT();

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

export { registerUser, loginUser };
