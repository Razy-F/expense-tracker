import { Schema, model } from "mongoose";

const TransactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    category: {
      type: String,
      enum: ["savings", "expense", "investment"],
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      default: "Unknown",
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Transaction", TransactionSchema);
