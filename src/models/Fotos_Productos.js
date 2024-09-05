import { DataTypes } from "sequelize";

const fotosProductosAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idProducto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}

const fotosProductosMethods = {
    timestamps: false
}

const FotosProductosModel = {
    fotosProductosAttributes,
    fotosProductosMethods
}

export {FotosProductosModel}