import { DataTypes } from "sequelize";

const categoriasProductosAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}

const categoriasProductosMethods = {
    timestamps: false
}

const CategoriasProductosModel = {
    categoriasProductosAttributes,
    categoriasProductosMethods
}

export {CategoriasProductosModel}