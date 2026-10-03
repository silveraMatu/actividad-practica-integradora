import { body } from "express-validator";

export const registerValidator = [
    body("name")
        .exists().withMessage("El nombre es obligatorio")
        .bail()
        .isString().withMessage("El nombre debe ser un texto")
        .bail()
        .trim()
        .notEmpty().withMessage("El nombre no puede estar vacío")
        .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres"),

    body("email")
        .exists().withMessage("El email es obligatorio")
        .bail()
        .isString().withMessage("El email debe ser un texto")
        .bail()
        .trim()
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("El email no tiene un formato válido")
        .normalizeEmail(),

    body("password")
        .exists().withMessage("La contraseña es obligatoria")
        .bail()
        .isString().withMessage("La contraseña debe ser un texto")
        .bail()
        .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const loginValidator = [
    body("email")
        .exists().withMessage("El email es obligatorio")
        .bail()
        .isString().withMessage("El email debe ser un texto")
        .bail()
        .trim()
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("El email no tiene un formato válido")
        .normalizeEmail(),

    body("password")
        .exists().withMessage("La contraseña es obligatoria")
        .bail()
        .isString().withMessage("La contraseña debe ser un texto")
        .bail()
        .notEmpty().withMessage("La contraseña no puede estar vacía"),
]; 