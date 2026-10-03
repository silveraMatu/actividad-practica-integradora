import { body, param } from "express-validator";
import { TicketStatus } from "./ticket.entity.js";

export const createTicketValidations = [
  body("title")
    .notEmpty()
    .withMessage("El titulo es requerido")
    .bail(),
  body("description")
    .notEmpty()
    .withMessage("La descripcion es requerida")
    .bail(),
  body("userId")
    .notEmpty()
    .withMessage("El userId es requerido")
    .isMongoId()
    .withMessage("El userId debe ser un ObjectId válido")
    .bail(),
]

export const changeTicketStatusValidation = [
  param("id")
    .notEmpty()
    .withMessage("El id es requerido")
    .isMongoId()
    .withMessage("El id debe ser un ObjectId válido")
    .bail(),
  body("status")
    .notEmpty()
    .withMessage("El estado es requerido")
    .isIn(Object.values(TicketStatus) as string[])
    .withMessage("El estado debe ser uno de los siguientes: ABIERTO, EN_PROGRESO, RESUELTO, CERRADO")
]

export const deleteTicketValidation = [
  param("id")
    .notEmpty()
    .withMessage("El id es requerido")
    .isMongoId()
    .withMessage("El id debe ser un ObjectId válido")
    .bail(),
]