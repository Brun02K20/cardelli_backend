import { DataTypes } from "sequelize";

const medidasOfertasAttributes = {
    MedidaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idMedida' // Nombre de la columna en la base de datos
    },
    OfertaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idOferta' // Nombre de la columna en la base de datos
    }
}

const medidasOfertasMethods = {
    timestamps: false
}

const MedidasOfertasModel = {
    attributes: medidasOfertasAttributes,
    methods: medidasOfertasMethods
}

export {MedidasOfertasModel}