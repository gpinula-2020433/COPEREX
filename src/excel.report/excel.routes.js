import { Router } from 'express';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';
import { createExcel } from './excel.controller.js';

const api = Router();

api.get('/', createExcel)

export default api