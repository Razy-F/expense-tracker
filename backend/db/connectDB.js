import { connect } from "mongoose";
import env from "../utils/validateEnv.js";

export const connectDB = async () => {
  try {
    const conn = await connect(env.MONGO_DB, {
      dbName: "Expense_tracker",
    });
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.rainbow.underline.bold
    );
  } catch (error) {
    console.error(`Error : ${error.message}`);
    process.exit(1);
  }
};
