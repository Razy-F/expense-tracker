import { mergeTypeDefs } from "@graphql-tools/merge";
import usertypeDef from "./user.typeDef.js";
import transactiontypeDef from "./transaction.typeDef.js";

export default mergeTypeDefs([usertypeDef, transactiontypeDef]);
