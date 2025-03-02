import mongoose from "mongoose";

const metaSchema = new mongoose.Schema(
  {
    master: {
      type: String,
      required: true,
      default: "0",
    },
    visa: {
      type: String,
      required: true,
      default: "0",
    },
    amex: { 
      type: String,
      required: true,
      default: "0",
    },
  },
  { timestamps: true }
);

const metaModel = mongoose.model("meta", metaSchema);

export default metaModel;
