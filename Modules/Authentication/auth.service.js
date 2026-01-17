import userModel from "../../DbModels/users.model.js";
import bcrypt from "bcryptjs";

const userSignupService = async (payload) => {
  const { name, email, password } = payload;

  const person = await userModel.findOne({ email });
  if (person) return { success: false, message: "User already exists. Please login to continue" };

  const passSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(String(password), passSalt);

  const userData = new userModel({
    name,
    email,
    password: hashedPassword,
  });

  await userData.save();

  return { success: true, user: userData };
};

const userLoginService = async (useremail) => {
  const isUsr = await userModel.findOne({ email: useremail });
  if (!isUsr) return { success: false, message: "User not found" };
  return { success: true, user: isUsr };
};

export const userService = {
  userSignupService,
  userLoginService,
};
