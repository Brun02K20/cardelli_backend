import { sequelize } from "../databases/databases.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getAll = async () => {
    const usuarios = await sequelize.models.Usuarios.findAll()
    return usuarios.map(usuario => usuario.dataValues)
}

// body = {usuario: "usuario", password: "password"}
const createUsuario = async (body) => {
    try {
        const hashed = await bcrypt.hash(body.password, 10)

        const createdUser = await sequelize.models.Usuarios.create({
            usuario: body.usuario,
            password: hashed
        })

        return createdUser.dataValues
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') { // si viola las restricciones UNIQUE de nombre de usuario
            // Manejar el error de restricción única
            return { error: 'Ya existe un usuario con ese nombre' };
        } else {
            // Manejar otros errores
            console.log("ERROR AL CREAR USUARIO: ", error);
            return { error: 'Error al crear el usuario.' };
        }
    }
}

// body = {usuario: "usuario", password: "password"}
const login = async (body) => {
    const usuario = await sequelize.models.Usuarios.findOne({
        where: {
            usuario: body.usuario
        }
    })

    if (usuario) {
        const passwordMatch = await bcrypt.compare(body.password, usuario.dataValues.password)
        if (passwordMatch) {
            const token = jwt.sign(
                {
                    usuario: usuario.dataValues.usuario,
                }, "poronga", { expiresIn: '7d' }
            );

            return {
                usuario: usuario.dataValues.usuario,
                token: token
            }

        } else {
            return { error: "Usuario no encontrado" } // anda
        }
    } else {
        return { error: "Usuario no encontrado" } // anda
    }
}

const usuarios_services = {
    getAll,
    createUsuario,
    login
}

export { usuarios_services }