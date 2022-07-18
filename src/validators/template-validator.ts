import { body, param } from "express-validator";
import { BadRequestError } from "../errors";
import { userRepository, templateRepository } from "../infra/repositories";

export const createTemplateValidator = [
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
];

export const updateTemplateValidator = [
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
];

export const templateIdValidator = [
  param("templateId")
    .isMongoId()
    .custom(async (value, { req }) => {
      let foundContent = await templateRepository.findOneById(value);
      if (foundContent == null)
        throw new BadRequestError("Please provide a valid Template Id");

      return true;
    })
    .withMessage("Template ID is required"),
];

