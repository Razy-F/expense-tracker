import { handleError } from "../lib/handleError";
import TransactionModel from "../models/transaction.model.js";
const transactionResolver = {
  Mutation: {
    async createTransaction(_, { input }, context) {
      try {
        const newTransaction = new TransactionModel({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {}
    },
    async updateTransaction(_, { input }, context) {
      try {
        const updatedTransaction = await TransactionModel.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (error) {
        handleError(error, "update a transaction");
      }
    },
    async deleteTransaction(_, { transactionId }, context) {
      try {
        const deletedTransaction = new TransactionModel.findByIdAndDelete(
          transactionId
        );
        return this.deleteTransaction;
      } catch (error) {
        handleError(error, "Delete a transaction");
      }
    },
  },
  Query: {
    transactions: async () => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;
        const transactions = await TransactionModel.find({ userId });
        return transactions;
      } catch (error) {
        handleError(error, "get transactions");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await TransactionModel.findById(transactionId);
        return transaction;
      } catch (error) {
        handleError(error, "Get specefic transaction");
      }
    },
  },
};

export default transactionResolver;
