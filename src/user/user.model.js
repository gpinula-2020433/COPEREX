//Modelo de usuario
 
import {Schema, model} from 'mongoose'
 
const userSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength:[25, `Can't be overcame 25 characters`]
 
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, `can't be overcame 25 characters`]
        },
        username: {
            type: String,
            unique: [true, 'Username is alredy taken'],
            lowercase: true,
            maxLength: [15, `can't be overcame 25 characters`]
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be 8 characters'],
            maxLength: [100, `can't be overcame 16 characters`],
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            minLength: [8,`can't be overcame 16 characters`],
            maxLength: [13, 'Phone must be 13 numbers'],
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            uppercase: true,
            enum: ['ADMIN', 'CLIENT']
        }
    },
    {
        versionKey: false, //Deshabilitar el __v(Versión del documento) que aparace por defecto en mongo db
        timestamps: true //Agrega propiedades de fecha (Fecha de creación y de ultima actualización)
    }
)

//Modificar el toJSON -> toObject para excluis datos en la respuesta
userSchema.methods.toJSON = function(){
    //Convertimos un documento de MongoDB a Objeto de JS
    const { __v, password, ...user } = this.toObject()
    return user
}

//Crear y exportar el modelo
export default model('User', userSchema)