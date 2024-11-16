import mongoose from "mongoose";

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
    photo: { type: String },
    password: { type: String, required: true },
    normalUser: { type: Boolean, default: true },
    admin: { type: Boolean, default: false },
    guide: { type: Boolean, default: false },
    otp: { type: Number },
    officialDocuments: { type: String },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
