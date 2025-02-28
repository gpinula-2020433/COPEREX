import { Router } from 'express';
import { 
    
} from './company.controller.js';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';

const api = Router();

api.get('/', )
api.get('/:id', [validateJwt, isAdmin], )
api.post('/', [validateJwt, isAdmin], )
api.put('/:id', [validateJwt, isAdmin] , )
api.delete('/:id', [validateJwt, isAdmin] , )

export default api