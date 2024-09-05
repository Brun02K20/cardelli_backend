import { DataTypes } from "sequelize";

const productosAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(2),
        allowNull: false
    },
}

const productosMethods = {
    timestamps: false
}

const ProductosModel = {
    productosAttributes,
    productosMethods
}

export {ProductosModel}