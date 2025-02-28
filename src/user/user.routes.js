import { Router } from "express";
import { 
    getAll,
    get,
    update,

    updatePassword
    //updateProfilePicture
 } from "./user.controller.js";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";
import { updateUserValidator } from "../../middlewares/validators.js";

const api = Router()

//Rutas privadas (Solo puede acceder su está logeado)
api.get('/',  getAll)
api.get('/:id', [validateJwt], get) //El campo del token se llama authorization, se usa get
api.put('/updatepassword/:id', validateJwt, updatePassword)
api.put('/:id', 
    [
        validateJwt, 
        updateUserValidator
    ],
    update
)


export default api

