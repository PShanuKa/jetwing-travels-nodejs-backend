import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const paymentHistorySchema = new mongoose.Schema({
  mount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Success", "Failed"],
    required: true,
  },
  failureReason: {
    type: String,
  },
});

const invoiceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  invoiceNumber: {
    type: String,
    required: [true, "Invoice number is required"],
    unique: [true, "Invoice number must be unique"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  tourNumber: {
    type: String,
    required: [true, "Tour number is required"],
    unique: [true, "Tour number must be unique"],
  },
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
  },
  secondaryEmail: {
    type: String,
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
  },
  ccEmail: {
    type: String,
  },
  ccEmail2: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
  },
  postalCode: {
    type: String,
    required: [true, "Postal code is required"],
  },
  nicOrPassport: {
    type: String,
    required: [true, "NIC or Passport is required"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
  },
  advancePayment: {
    type: Number,
    default: 0,
  },
  dueDate: {
    type: Date,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  paymentHistory: [paymentHistorySchema],
  invoiceItems: [invoiceItemSchema],
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
