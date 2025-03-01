import Company from './company.model.js'


//Función para registrar un company
export const save = async(req, res) => {
    const data = req.body
    try {

        //Si da false es porque no existe y lo guarda directamente
        if(await Company.findOne({name: data.name})){
            return res.send(
                {
                    success: false,
                    message: `The company | ${data.name} | already exists`
                }
            )
        }
        const categoriaExistente = await Company.findOne(
            {description: data.description}
        )
        if(categoriaExistente){
            return res.send(
                {
                    success: false,
                    message: `The company | ${categoriaExistente.name} | already has that description`
                }
            )
        }

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
        
        if(await Company.findOne({name: data.name})){
            return res.send(
                {
                    success: false,
                    message: `The company | ${data.name} | already exists`
                }
            )
        }
        const categoriaExistente = await Company.findOne(
            {description: data.description}
        )
        if(categoriaExistente){
            return res.send(
                {
                    success: false,
                    message: `The company | ${categoriaExistente.name} | already has that description`
                }
            )
        }

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
        yearsInBusiness, 
        orderByName 
    } = req.query // Leer los filtros desde los parámetros de la URL

    try {
        // Filtros de la consulta
        const filters = {}

        // Filtrar por categoría (si se pasa el parámetro 'category')
        if (category) {
            filters.category = category
        }

        // Filtrar por años de trayectoria (si se pasa el parámetro 'yearsInBusiness')
        if (yearsInBusiness) {
            filters.yearsInBusiness = yearsInBusiness // Filtra empresas con años de trayectoria mayores o iguales a 'yearsInBusiness'
        }

        // Realizar la consulta con los filtros
        //Si no se pasan filtros, devolveria todos los datos
        let companiesQuery = Company.find(filters)
            .skip(0)  // Usamos parseInt para convertir los parámetros a números (si están presentes)
            .limit(20)  // Similar para el límite de resultados
            .populate('registeredBy', 'username -_id')  // Aquí asumo que quieres el 'username' del usuario que registró la empresa

        // Ordenar las empresas (por nombre, A-Z o Z-A, si se pasa el parámetro 'orderByName')
        if (orderByName) {
            //1 es para ascendente y -1 es para descendente
            //if orderByName es igual a 'asc' entonces lo ordena ascendente (1 para ascendente A-B)
            //Si no entonces lo ordena descente (-1 para descendente B-A)
            const sortOrder = orderByName === 'asc' ? 1 : -1 
            companiesQuery = companiesQuery.sort({ name: sortOrder })
        }

        const companies = await companiesQuery

        if (companies.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Companies not found'
            })
        }

        return res.send({
            success: true,
            message: 'Companies found:',
            total: companies.length,
            companies
        })

    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}


