import { body, param } from "express-validator";
import { BadRequestError } from "../errors";
import { userRepository, SMTPRepository } from "../infra/repositories";

export const createSMTPValidator = [
  body("senderMail").isEmail().withMessage("SenderMail is required"),
  body("host").isString().withMessage("Host is required"),
  body("password").isString().withMessage("Password is required"),
  body("secure").isBoolean().withMessage("Secure state is requred"),
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
  body("port").isPort().withMessage("Port is required"),
  body("userName").isString().withMessage("Host is required"),
];

export const SMTPIdValidator = [
  param("smtpId")
    .isMongoId()
    .custom(async (value, { req }) => {
      let foundContent = await SMTPRepository.findOneById(value);
      if (foundContent == null)
        throw new BadRequestError("Please provide a valid SMTP Id");

      return true;
    })
    .isString()
    .withMessage("SMTP ID is required"),
];

export const bodySMTPIdValidator = [
  body("smtpId")
    .isMongoId()
    .custom(async (value, { req }) => {
      let foundContent = await SMTPRepository.findOneById(value);
      if (foundContent == null)
        throw new BadRequestError("Please provide a valid SMTP Id");

      return true;
    })
    .isString()
    .withMessage("SMTP ID is required"),
];
