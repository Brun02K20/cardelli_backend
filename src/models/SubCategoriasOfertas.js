import { DataTypes } from "sequelize";

const subCategoriasOfertasAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idCategoriaOferta: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}

const subCategoriasOfertasMethods = {
    timestamps: false
}

const SubCategoriasOfertasModel = {
    subCategoriasOfertasAttributes,
    subCategoriasOfertasMethods
}

export {SubCategoriasOfertasModel}