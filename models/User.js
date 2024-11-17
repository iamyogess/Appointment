import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (value) {
          return value || this.phoneNo;
        },
      },
    },
    phoneNo: {
      type: BigInt,
      unique: true,
      validate: {
        validator: function (value) {
          return value || this.email;
        },
      },
    },
    profilePicture: { type: String },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    normalUser: { type: Boolean, default: true },
    guide: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    otp: { type: Number },
    officialDocuments: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  }
});

userSchema.methods.generateJWT = function () {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
