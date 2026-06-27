import type {
  ChangePasswordInput,
  LoginInput,
  ResetPasswordInput,
  ResetPasswordTokenInput,
  SignupInput,
} from "@workspace/shared-types";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import env from "@/configs/env";
import { passwordUpdated } from "@/mail/templates/password-update-mail-template";
import Profile from "@/modules/profile/models/profile.model";
import { ApiError } from "@/shared/utils/api-error";
import { sendEmail } from "@/shared/utils/send-mail";
import OTP from "../models/otp.model";
import User from "../models/user.model";

export const sendOtp = async (email: string) => {
  const checkUserPresent = await User.findOne({ email });
  if (checkUserPresent) {
    throw ApiError.unauthorized("User is Already Registered");
  }

  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  let result = await OTP.findOne({ otp });
  while (result) {
    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    result = await OTP.findOne({ otp });
  }

  const otpPayload = { email, otp };
  await OTP.create(otpPayload);
  // OTP sent successfully, no need to return it to the frontend
};

export const signup = async (body: SignupInput) => {
  const {
    firstName,
    lastName,
    email,
    password,
    accountType,
    contactNumber,
    otp,
  } = body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict("User already exists. Please sign in to continue.");
  }

  const otpResponse = await OTP.find({ email })
    .sort({ createdAt: -1 })
    .limit(1);

  if (otpResponse.length === 0) {
    throw ApiError.validation("The OTP is not valid");
  }
  if (otp !== otpResponse[0].otp) {
    throw ApiError.validation("The OTP is not valid");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const approved = accountType === "Instructor" ? false : true;

  const profileDetails = await Profile.create({
    gender: null,
    dateOfBirth: null,
    about: null,
    contactNumber: null,
  });

  const user = await User.create({
    firstName,
    lastName,
    email,
    contactNumber,
    password: hashedPassword,
    accountType,
    approved,
    additionalDetails: profileDetails._id,
    image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`,
  });

  return user;
};

export const login = async (body: LoginInput) => {
  const { email, password } = body;

  const user = await User.findOne({ email }).populate("additionalDetails");
  if (!user) {
    throw ApiError.unauthorized(
      "User is not Registered with Us Please SignUp to Continue"
    );
  }

  if (await bcrypt.compare(password, user.password)) {
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    user.token = refreshToken;
    user.password = "HIDDEN";

    return { accessToken, refreshToken, user };
  }
  throw ApiError.unauthorized("Password is incorrect");
};

export const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as {
      id: string;
    };
    const user = await User.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });

    return { accessToken };
  } catch (_error) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }
};

export const changePassword = async (
  userId: string,
  body: ChangePasswordInput
) => {
  const userDetails = await User.findById(userId);
  if (!userDetails) {
    throw ApiError.notFound("User not found");
  }

  const { oldPassword, newPassword } = body;

  const isPasswordMatch = await bcrypt.compare(
    oldPassword,
    userDetails.password
  );

  if (oldPassword === newPassword) {
    throw ApiError.validation("New Password cannot be same as Old Password");
  }

  if (!isPasswordMatch) {
    throw ApiError.unauthorized("The password is incorrect");
  }

  const encryptedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUserDetails = await User.findByIdAndUpdate(
    userId,
    { password: encryptedPassword },
    { new: true }
  );

  try {
    await sendEmail(
      updatedUserDetails?.email || "",
      "Nextdemy - Password Updated",
      passwordUpdated(
        updatedUserDetails?.email || "",
        `Password updated successfully for ${updatedUserDetails?.firstName} ${updatedUserDetails?.lastName}`
      )
    );
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw ApiError.server("Error occurred while sending email");
  }
};

export const resetPasswordToken = async (body: ResetPasswordTokenInput) => {
  const { email } = body;
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.validation(
      `This Email: ${email} is not Registered With Us Enter a Valid Email `
    );
  }

  const token = crypto.randomBytes(20).toString("hex");

  await User.findOneAndUpdate(
    { email },
    {
      token,
      resetPasswordExpires: Date.now() + 3_600_000, // 1hr
    },
    { new: true }
  );

  const url = `${env.UPDATE_PASSWORD_BASE_URL}/${token}`;

  await sendEmail(
    email,
    "Password Reset",
    `Your Link for email verification is ${url}. Please click this url to reset your password.`
  );
};

export const resetPassword = async (body: ResetPasswordInput) => {
  const { password, token } = body;

  const userDetails = await User.findOne({ token });
  if (!userDetails?.resetPasswordExpires) {
    throw ApiError.validation("Invalid token or token has expired.");
  }

  if (userDetails.resetPasswordExpires.getTime() <= Date.now()) {
    throw ApiError.forbidden(
      "Token has expired. Please regenerate your token."
    );
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await User.findOneAndUpdate(
    { token },
    {
      password: encryptedPassword,
      token: undefined,
      resetPasswordExpires: undefined,
    },
    { new: true }
  );
};
