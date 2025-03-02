//Gestionar funciones de usuario

import { encrypt } from '../../utils/encrypt.js'
import User from './user.model.js'

//Listar todos
export const getAll = async(req,res)=>{
    try{
        //Configuraciones de paginación
        const { limit = 20, skip = 0} = req.query
        const users = await User.find()
            .skip(skip)
            .limit(limit)

        if(users.length === 0){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Users not found'
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Users found',
                users
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message: 'General error',e})
    }
}


//Para el admin por defecto
export const addDefaultAdmin = async()=>{
    try {
        //Verificamos si no esta creada
        const adminExists = await User.findOne(
            {
                name:'DefaultAdmin'
            }
        )
        //Si no existe que la cree
        if(!adminExists){
            let passwordAdmin = process.env.DEFAULTPASSWORD_ADMIN
            let usernameAdmin = process.env.DEFAULTADMINUSER
            let adminUser = new User(
                {
                    name: 'DefaultAdmin',
                    surname: 'Admin',
                    username: usernameAdmin,
                    email: 'admin@gmail.com',
                    password: passwordAdmin,
                    phone: '54411221',
                    role: 'ADMIN'
                }
            )
            //La guardamos encriptada
            adminUser.password = await encrypt(adminUser.password)
            await adminUser.save()
        }
    } catch (err) {
        console.error('Error creating default admin', err)
    }
}
