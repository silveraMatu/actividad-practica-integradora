import { param } from "express-validator";

export const subscriptionValidator = [
  param("ticketId")
    .notEmpty()
    .withMessage("ticketId es requerido")
    .isMongoId()
    .withMessage("ticketId inválido"),
];

export const deleteSubscriptionValidator = [
  param("id")
    .notEmpty()
    .withMessage("id es requerido")
    .isMongoId()
    .withMessage("id inválido"),
];