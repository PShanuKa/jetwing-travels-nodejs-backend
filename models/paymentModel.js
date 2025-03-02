// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema({
//   invoice: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Invoice",
//     required: true,
//   },
//   customer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Customer",
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   currency: {
//     type: String,
//     enum: ["LKR", "USD", "EUR"],
//     required: true,
//   },
//   paymentMethod: {
//     type: String,
//     enum: ["Visa", "MasterCard", "Amex"],
//     required: true,
//   },
//   ipgReference: {
//     type: String,
//     required: true, // Reference to the specific IPG used for the transaction
//   },
//   status: {
//     type: String,
//     enum: ["Pending", "Success", "Failed", "Overdue"],
//     default: "Pending",
//   },
//   failureReason: {
//     type: String,
//   },
//   attempts: {
//     type: Number,
//     default: 0,
//   },
//   otpVerified: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Payment = mongoose.model("Payment", paymentSchema);

// export default Payment;