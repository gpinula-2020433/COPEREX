//Levantar el servidor
//Modular efectivo legible trabaja en funciones

'use strict'

//ECModules
import express from 'express'//servidor HTTP
import morgan from 'morgan'//logs
import helmet from 'helmet'//seguridad para HTTP
import cors from 'cors'//acceso al Api
import userRoutes from '../src/user/user.routes.js'
import authRoutes from '../src/auth/auth.routes.js'
import { limiter } from '../middlewares/rate.limit.js'
import { addDefaultAdmin } from '../src/user/user.controller.js'

//Configuraciones de express
const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))//No encriptar la URL
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)

}

const routes = (app)=>{
    app.use(authRoutes)
    app.use('/v1/user', userRoutes)
    
}

export const initServer =()=>{
    const app= express()
    try{
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port: ${process.env.PORT}`)
        addDefaultAdmin()
    }catch(err){
        console.error('Server init failed', err)
    }
}
