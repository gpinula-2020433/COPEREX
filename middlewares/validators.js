//Validar campos en las rutas

import { body } from "express-validator";
import { validateErrors } from "./validate.errors.js";
import { 

    
    notRequiredField, 
    existNameCompany,
    existDescriptionCompany
} from "../utils/db.validators.js";


export const registerCompanyValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty()
        .custom(existNameCompany),
    body('description', 'Description cannot be empty')
        .notEmpty()
        .custom(existDescriptionCompany),
    body('levelOfImpact', ' cannot be empty')
        .notEmpty(),
    body('yearsOfTrajectory', 'Years of trajectory cannot be empty')
        .notEmpty()
        .isInt()
        .withMessage('Years of trajectory must be a number integer'),
    body('category', ' cannot be empty')
        .notEmpty(),
    body('registeredBy', 'RegisterBy is not required' )
        .optional()
        .notEmpty(),
    validateErrors
]
export const updateCompanyValidator = [
    body('name', 'Name cannot be empty')
        .optional()
        .notEmpty()
        .custom(existNameCompany),
    body('description', 'Description cannot be empty')
        .optional()
        .notEmpty()
        .custom(existDescriptionCompany),
    body('levelOfImpact', ' cannot be empty')
        .optional()
        .notEmpty(),
    body('yearsOfTrajectory', 'Years of trajectory cannot be empty')
        .optional()
        .notEmpty()
        .isInt()
        .withMessage('Years of trajectory must be a number integer'),
    body('category', ' cannot be empty')
        .optional()
        .notEmpty(),
    body('registeredBy', 'RegisterBy is not required' )
        .optional()
        .notEmpty()
        .custom(notRequiredField),
    validateErrors
]