import { DataTypes } from "sequelize";

const fotosOfertasAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idOferta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}

const fotosOfertasMethods = {
    timestamps: false
}

const FotosOfertasModel = {
    fotosOfertasAttributes,
    fotosOfertasMethods
}

export {FotosOfertasModel}