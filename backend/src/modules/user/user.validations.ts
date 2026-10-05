import { body, param } from "express-validator";

export const assignRoleValidations = [
  param('id')
    .isMongoId()
    .withMessage("userId inválido"),
  body('roleId')
    .isMongoId()
    .withMessage("roleId inválido"),
];