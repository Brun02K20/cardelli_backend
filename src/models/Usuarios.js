import { DataTypes } from "sequelize";

const usuariosAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
}

const usuariosMethods = {
    timestamps: false
}

const UsuariosModel = {
    usuariosAttributes,
    usuariosMethods
}

export {UsuariosModel}