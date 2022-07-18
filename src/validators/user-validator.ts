import { body, param } from "express-validator";
import { BadRequestError } from "../errors";
import { userRepository } from "../infra/repositories";

export const signupValidator = [
  body("email").isEmail().withMessage("Email is required"),
  body("phone").isString().withMessage("Phone number is required"),
  body("password").trim().isLength({ min: 4, max: 20 }),
];

export const emailValidator = [
  body("email").isEmail().withMessage("Email is required"),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Email is required'),
  body('password').trim().notEmpty().withMessage('Password is required')
];
export const finalizeVerificationValidator = [
  body('verificationCode').notEmpty().withMessage('Verification is required'),
  body("userId")
  .isMongoId()
  .custom(async (value, { req }) => {
    let foundContent = await userRepository.findOneById(value);
    if (foundContent == null)
      throw new BadRequestError("Please provide a valid USER id");

    return true;
  })
  .isString()
  .withMessage("User ID is required"),
]

export const userIdValidator = [
  body("userId")
  .isMongoId()
  .custom(async (value, { req }) => {
    let foundContent = await userRepository.findOneById(value);
    if (foundContent == null)
      throw new BadRequestError("Please provide a valid User Id");

    return true;
  })
  .isString()
  .withMessage("User ID is required"),
]

export const getUserIdValidator = [
  param("userId")
  .isMongoId()
  .custom(async (value, { req }) => {
    let foundContent = await userRepository.findOneById(value);
    if (foundContent == null)
      throw new BadRequestError("Please provide a valid User Id");

    return true;
  })
  .isString()
  .withMessage("User ID is required"),
]


export const finalizePasswordResetValidator = [
  body('email').isEmail().withMessage('Email is required'),
  body('token').trim().notEmpty().withMessage('Token is required'),
  body('password').trim().notEmpty().withMessage('Password is required')
]

export const changePasswordValidator = [
  body('oldPassword').trim().notEmpty().withMessage('Old Password is required'),
  body('newPassword').trim().notEmpty().withMessage('New Password is required'),
  body("userId")
  .isMongoId()
  .custom(async (value, { req }) => {
    let foundContent = await userRepository.findOneById(value);
    if (foundContent == null)
      throw new BadRequestError("Please provide a valid User Id");

    return true;
  })
  .isString()
  .withMessage("User ID is required"),
]