import Company from './company.model.js'


//Función para registrar un company
export const save = async(req, res) => {
    const data = req.body
    try {

        data.registeredBy = req.user.uid
        const company = new Company(data)
        await company.save()
        return res.send(
            {
                success: true,
                message: `${company.name} saved successfully`,
                company
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

export const updateCompany = async(req, res)=>{
    try {
        const { id } = req.params
        const data = req.body

        const update = await Company.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )

        if(!update) 
        return res.status(404).send(
            {
                success: false,
                message: 'Company not found'
            }
        )
        return res.send(
            {
                success:true,
                message: 'Company updated',
                user: update
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}


export const getCompanyID = async(req, res)=>{
    try {
        let {id} = req.params
        let company = await Company.findById(id)
            .populate('registeredBy', 'username -_id')

        if(!company)
        return res.status(404).send(
            {
                success: false,
                message: 'Company not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Company found',
                company
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

//Obtener todos
export const getAll = async(req, res)=>{
    const { limit, skip } = req.query
    try{
        const companys = await Company.find()
            .skip(skip)
            .limit(limit)
            .populate('registeredBy', 'username -_id')

        if(companys.length === 0){
            return res.status(404).send(
                {
                    success: false,
                    message: 'companies not found'
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'companies found:',
                total: companys.length + ' categories',
                companys
            }
        )
 
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

// Obtener empresas con filtros y ordenación desde los parámetros de la URL
export const getFilteredAndSortedCompanies = async (req, res) => {
    const { 
        category, 
        yearsOfTrajectory, 
        orderByName 
    } = req.query // Leer los filtros desde los parámetros de la URL
    try {
        //Creamos una constante para almacenar los filtros de la consulta
        const filters = {}

        //Filtramos por categoria y años de trajectory si da true(si lo enviaron)
        if (category) {
            filters.category = category
        }
        if (yearsOfTrajectory) {
            filters.yearsOfTrajectory = yearsOfTrajectory
        }

        //Realizar la consulta con los filtros 
        //Si todos dan false es como que no se pasan filtros, devolveria todos los datos
        let companiesQuery = Company.find(filters)
            .skip(0)
            .limit(20)
            .populate('registeredBy', 'username -_id')

        // Ordenar las empresas (por nombre, A-Z o Z-A, si se pasa el parámetro 'orderByName')
        if (orderByName) {
            //1 es para ascendente y -1 es para descendente
            //if orderByName es igual a 'asc' entonces lo ordena ascendente (1 para ascendente A-B)
            //Si no entonces lo ordena descente (-1 para descendente B-A)
            const sortOrder = orderByName === 'asc' ? 1 : -1 
            companiesQuery = companiesQuery.sort({ name: sortOrder })
        }

        const companies = await companiesQuery
        if(companies.length === 0){
            return res.status(404).send(
                {
                    success: false,
                    message: 'companies not found'
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'companies found:',
                total: companies.length + ' categories',
                companies
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

