import { cleanEnv, str } from "envalid";

export default cleanEnv(process.env, {
  MONGO_DB: str(),
  SESSION_SECRET: str(),
});
