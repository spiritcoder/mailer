import { body, param } from "express-validator";
import { BadRequestError } from "../errors";
import { userRepository, mailListRepository } from "../infra/repositories";

export const createMailingListValidator = [
  body("mailListName").isString().withMessage("mailList Name is required"),
  body("userId")
    .isMongoId()
    .custom(async (value, { req }) => {
      let foundContent = await userRepository.findOneById(value);
      if (foundContent == null)
        throw new BadRequestError("Please provide a valid USER id");

      return true;
    })
    .withMessage("User ID is required"),
];

export const updateMailingListValidator = [
  body("templateName").isString().withMessage("Template Name is required"),
  body("template").isString().withMessage("Template is required"),
  body("variables").isArray().withMessage("Variable is required and must be an array"),
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
  
    body("templateId")
    .isMongoId()
    .custom(async (value, { req }) => {
      let foundContent = await userRepository.findOneById(value);
      if (foundContent == null)
        throw new BadRequestError("Please provide a valid Template id");

      return true;
    })
    .isString()
    .withMessage("Template ID is required"),
];

export const mailListIdValidator = [
  param("mailingListId")
    .isMongoId()
    .custom(async (value, { req }) => {
      let foundContent = await mailListRepository.findOneById(value);
      if (foundContent == null)
        throw new BadRequestError("Please provide a valid Template Id");

      return true;
    })
    .withMessage("Template ID is required"),
];

