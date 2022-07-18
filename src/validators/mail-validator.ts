import { body, param } from "express-validator";
import { BadRequestError } from "../errors";
import { userRepository, mailListRepository, templateRepository, mailLogRepository } from "../infra/repositories";

export const sendMailValidator = [
  body("emailSubject").isString().withMessage("Subject is required"),
  body("senderMail").isEmail().withMessage("Sender Mail is required"),
  body("context").isObject().withMessage("Context is required and must be an object"),
  body("userId")
    .isMongoId()
    .custom(async (value, { req }) => {
      let foundContent = await userRepository.findOneById(value);
      if (foundContent == null)
        throw new BadRequestError("Please provide a valid USER id");

      return true;
    })
    .withMessage("User ID is required"),
  
  body("templateId")
    .isMongoId()
    .custom(async (value, { req }) => {
      let foundContent = await templateRepository.findOneById(value);
      if (foundContent == null)
        throw new BadRequestError("Please provide a valid Template id");

      return true;
    })
    .withMessage("Template ID is required"),
  
  body("mailListId")
    .isMongoId()
    .custom(async (value, { req }) => {
      let foundContent = await mailListRepository.findOneById(value);
      if (foundContent == null)
        throw new BadRequestError("Please provide a valid MailList id");

      return true;
    })
  .withMessage("MailList ID is required"),
];

export const mailLogIdValidator = [
  param("mailLogId")
    .isMongoId()
    .custom(async (value, { req }) => {
      let foundContent = await mailLogRepository.findOneById(value);
      if (foundContent == null)
        throw new BadRequestError("Please provide a valid Mail log Id");

      return true;
    })
    .withMessage("Mail log ID is required"),
];

