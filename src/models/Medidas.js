import { DataTypes } from "sequelize";

const medidasAttributes = {
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

const medidasMethods = {
    timestamps: false
}

const MedidasModel = {
    attributes: medidasAttributes,
    methods: medidasMethods
}

export {MedidasModel}