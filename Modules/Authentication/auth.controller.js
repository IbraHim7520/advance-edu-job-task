import envConfig from "../../Configs/envConfig.js";
import generateToken from "../../Middlewers/GenToken.js";
import { userService } from "./auth.service.js";
import bcrypt from "bcryptjs";

const userSignupControle = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "All fields are required!" });

  try {
    const registerResponse = await userService.userSignupService(req.body);

    if (!registerResponse._id) {
      return res.status(400).json({
        success: false,
        result: registerResponse,
      });
    }

    const token = generateToken(registerResponse._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: envConfig.node_env === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      token,
      result: registerResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      result: error.message || "Auth service error!",
    });
  }
};

const userLoginControle = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ success: false, message: "All fields are required!" });

  try {
    const userResponse = await userService.userLoginService(email);

    if (!userResponse._id) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const isPassMatched = await bcrypt.compare(password, userResponse.password);
    if (!isPassMatched) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userResponse._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: envConfig.node_env === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, result: "User login successful." });
  } catch (error) {
    res.status(500).json({ success: false, result: error.message || "Auth service error!" });
  }
};

const getProfileController = async (req, res) => {
  try {
    res.status(200).json({ success: true, result: req.user });
  } catch (error) {
    res.status(500).json({ success: false, result: error.message || "Auth service error!" });
  }
};

const userLoggetOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, result: "Failed to logout!" });
  }
};

export const authController = {
  userSignupControle,
  userLoginControle,
  getProfileController,
  userLoggetOut,
};
