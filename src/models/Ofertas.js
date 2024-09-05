import { DataTypes } from "sequelize";

const ofertasAttributes = {
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
    precioSinOferta: {
        type: DataTypes.DECIMAL(2),
        allowNull: false
    },
    precioConOferta: {
        type: DataTypes.DECIMAL(2),
        allowNull: false
    },
    idSubCategoria: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}

const ofertasMethods = {
    timestamps: false
}

const OfertasModel = {
    attributes: ofertasAttributes,
    methods: ofertasMethods
}

export {OfertasModel}