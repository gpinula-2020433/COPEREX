import { Router } from 'express';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';
import { generateExcel } from './excel.controller.js';

const api = Router();

api.get('/', [validateJwt, isAdmin], generateExcel)

export default api