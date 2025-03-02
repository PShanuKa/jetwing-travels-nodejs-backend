import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    nicOrPassport: {
      type: String,
      required: [true, "NIC or Passport is required"],
    },
    role: {
      type: String,
      enum: ["executive", "admin", "superAdmin"],
      default: "executive",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    companies: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Company",
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
