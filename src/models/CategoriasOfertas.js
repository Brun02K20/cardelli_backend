import { DataTypes } from "sequelize";

const categoriasOfertasAttributes = {
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

const categoriasOfertasMethods = {
    timestamps: false
}

const CategoriasOfertasModel = {
    categoriasOfertasAttributes,
    categoriasOfertasMethods
}

export {CategoriasOfertasModel}