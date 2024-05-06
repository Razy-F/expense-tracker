import bcrypt from "bcryptjs";
import { users } from "../dummyData/data.js";
import User from "../models/user.model.js";
import { handleError } from "../lib/handleError.js";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      console.log(context);
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profilePicture =
          username.split(" ")[0].charAt(0) + username.split(" ")[1].charAt(0);

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture,
        });

        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (error) {
        handleError(error, "signUp");
      }
    },
    login: async (_, { input }, context) => {
      console.log("hello from login");
      try {
        const { username, password } = input;
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });
        await context.login(user);
        return user;
      } catch (error) {
        handleError(error, "login");
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw err;
        });
        context.res.clearCookie("connect.sid");
        return { messege: "Logout Successfuly" };
      } catch (error) {
        handleError(error, "logout");
      }
    },
  },
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        handleError(error, "authUser");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        handleError(error, "return specific user");
      }
    },
  },
};

export default userResolver;
