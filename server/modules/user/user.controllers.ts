import type { RequestHandler } from "express";
import * as userService from "./user.services";
import { sendEmail } from "../../config/mailer.config";
import { envConfig } from "../../config/env.config";
import prisma from "../../libs/prisma";
import { AppError } from "../../middlewares/errors-handle.middleware";
import { getCookieOptions } from "../../config/cookie.config";
import * as userUtility from "./user.utils";
//** Register user */
const register: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.createUser(req);
    const link = `${envConfig.clientUrl}/verify-email/${user.id}`;
    await sendEmail(
      user.email,
      user.name || "User",
      "Verify Your Email",
      `Click the link below to Verify Your Email",: ${link}`,
      link
    );
    res.status(201).json({ message: `Verification Email Sent to ${user.email}`, user });
  } catch (err) {
    next(err);
  }
};

//** Login user */
const login: RequestHandler = async (req, res, next) => {
  try {
    const { user, ...rest } = await userService.loginUser(req);

    // Set cookies on client
    // userService.setCookies(res, accessToken, refreshToken);
   res.cookie("access_token", rest.accessToken, getCookieOptions(60 * 60)); // 1 hour
    res
      .status(200)
      .json({
        message: "Login Successfully ",
        user: { ...user, ...rest },
      });
  } catch (err) {
    next(err);
  }
};

//** Logout user */
const logout: RequestHandler = async (req, res, next) => {
  try {
    userUtility.clearCookies(res);
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
};

//** Get user profile */
const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//** Update user */
const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req);
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.log({ err });
    next(err);
  }
};

//** Delete user **/
const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.user.id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

//** Forgot password */
const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
   const email = await userService.generateResetToken(req);
    res.status(200).json({ message: `Password reset link sent to ${email}` });
  } catch (error) {
    next(error);
  }
};

//** Reset password */
const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    await userService.resetPassword(req);
    res.status(200).json({ message: "Password reset successfully, please login" });
  } catch (error) {
    next(error);
  }
};

/**Admin Controllers */
const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const deleteUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userService.deleteUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export {
  register,
  login,
  logout,
  getProfile,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUsers,
};
