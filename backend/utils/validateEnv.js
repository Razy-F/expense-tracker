import { cleanEnv, str, url } from "envalid";

export default cleanEnv(process.env, {
  MONGO_DB: str(),
  SESSION_SECRET: str(),
  ORIGIN_URL: url(),
});
