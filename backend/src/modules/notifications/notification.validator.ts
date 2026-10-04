import { param } from "express-validator";

export const markAsReadValidator = [
  param("id")
    .notEmpty()
    .withMessage("id es requerido")
    .isMongoId()
    .withMessage("id inválido"),
];
