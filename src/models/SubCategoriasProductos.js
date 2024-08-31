import { DataTypes } from "sequelize";

const subCategoriasProductosAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idCategoriaProducto: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}

const subCategoriasProductosMethods = {
    timestamps: false
}

const SubCategoriasProductosModel = {
    subCategoriasProductosAttributes,
    subCategoriasProductosMethods
}

export {SubCategoriasProductosModel}