import { handleError } from "../lib/handleError.js";
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
    transactions: async (_, __, context) => {
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
    categoryStatistics: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;
        const transactions = await TransactionModel.find({ userId });
        const categoryMap = {};

        /*  const transactions = [
          {category:"expense", amount:50},
          {category:"expense", amount:75},
          {category:"investment", amount:100},
          {category:"savings", amount:30},
          {category:"savings", amount:20},
        ] */

        transactions.forEach((transaction) => {
          if (!categoryMap[transaction.category]) {
            categoryMap[transaction.category] = 0;
          }
          categoryMap[transaction.category] += transaction.amount;
        });

        console.log("This is categoryMap constant: ", categoryMap);
        /* categoryMap = { expense: 125, investment: 100, savings: 50 }; */

        return Object.entries(categoryMap).map(([category, totalAmount]) => ({
          category,
          totalAmount,
        }));
        // it return array of objects
        /* return [
          { category: "expense", totalAmount: 125 },
          { category: "investment", totalAmount: 125 },
          { category: "savings", totalAmount: 125 },
        ]; */

        /* const obj = { 0: "adam", 1: "billy", 2: "chris" };

        console.log(Object.entries(obj));
        [
          ["0", "adam"],
          ["1", "billy"],
          ["2", "chris"],
        ];

        console.log(Object.entries(obj).map((line) => console.log(line)));
        ["0", "adam"][("1", "billy")][("2", "chris")]; */
      } catch (error) {
        handleError(error, "categoryStatistics");
      }
    },
  },
};

export default transactionResolver;
