import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
    },
    secondaryEmail: {
        type: String,
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
    },
    nicOrPassport: {
        type: String,
        required: [true, "NIC/Passport is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
    postalCode: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Created by is required"],
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: [true, "Company is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
