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
import categoryRoutes from '../src/category/category.routes.js'
import publicationRoutes from '../src/publication/publication.routes.js'
import commentRoutes from '../src/comment/comment.routes.js'
import { limiter } from '../middlewares/rate.limit.js'
import { addDefaultCategory } from '../src/category/category.controller.js'
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
    app.use('/v1/category', categoryRoutes)
    app.use('/v1/publication', publicationRoutes)
    app.use('/v1/comment', commentRoutes)
}

export const initServer =()=>{
    const app= express()
    try{
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port: ${process.env.PORT}`)
        addDefaultCategory()
        addDefaultAdmin()
    }catch(err){
        console.error('Server init failed', err)
    }
}
