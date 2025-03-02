import { Router } from 'express';
import { 
    save,
    updateCompany,
    getCompanyID,
    getAll,
    getFilteredAndSortedCompanies
} from './company.controller.js';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';
import {
    registerCompanyValidator,
    updateCompanyValidator
} from '../../middlewares/validators.js'

const api = Router();

api.get('/', getAll)
api.get('/companiesFiltered', getFilteredAndSortedCompanies )
api.get('/:id', [validateJwt, isAdmin], getCompanyID)

api.post('/', [validateJwt, isAdmin, registerCompanyValidator], save)
api.put('/:id', [validateJwt, isAdmin, updateCompanyValidator] , updateCompany)

export default api