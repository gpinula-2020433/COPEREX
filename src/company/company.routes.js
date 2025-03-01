import { Router } from 'express';
import { 
    save,
    updateCompany,
    getCompanyID,
    getAll,
    getFilteredAndSortedCompanies
} from './company.controller.js';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';

const api = Router();

api.get('/', getAll)
api.get('/companiesFiltered',getFilteredAndSortedCompanies )
api.get('/:id', [validateJwt, isAdmin], getCompanyID)
api.post('/', [validateJwt, isAdmin], save)
api.put('/:id', [validateJwt, isAdmin] , updateCompany)
//api.delete('/:id', [validateJwt, isAdmin] , ) no hay delete

export default api