import { DataTypes } from "sequelize";

const medidasProductosAttributes = {
    MedidaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idMedida' // Nombre de la columna en la base de datos
    },
    ProductoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idProducto' // Nombre de la columna en la base de datos
    }
}

const medidasProductosMethods = {
    timestamps: false
}

const MedidasProductosModel = {
    attributes: medidasProductosAttributes,
    methods: medidasProductosMethods
}

export {MedidasProductosModel}