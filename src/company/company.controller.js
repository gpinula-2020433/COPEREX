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

//Obtener todos
export const getAllC = async(req, res)=>{
    const { limit, skip } = req.query
    try{
        const companys = await Company.find()
            .skip(skip)
            .limit(limit)
            .populate('user', 'username -_id')

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

export const updateCompany = async(req, res)=>{
    try {
        const { id } = req.params
        const data = req.body
        
        //Si da false es porque no existe y lo actualiza directamente
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


export const getCompany = async(req, res)=>{
    try {
        let {id} = req.params
        let company = await Company.findById(id)
            .populate('user', 'username -_id')

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