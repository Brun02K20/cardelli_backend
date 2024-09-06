import { sequelize } from "../databases/databases.js";

const getAllMedidas = async () => {
    try {
        const medidas = await sequelize.models.Medidas.findAll();
        return medidas.map(medida => medida.dataValues);
    } catch (error) {
        console.log("ERROR AL OBTENER MEDIDAS: ", error);
        return { error: 'Error al obtener las medidas.' };
    }
}

const createMedida = async (body) => {
    try {
        const createdMedida = await sequelize.models.Medidas.create({
            nombre: body.nombre
        })

        return createdMedida.dataValues
    } catch (error) {
        console.log("ERROR AL CREAR MEDIDA: ", error);
        return { error: 'Error al crear la medida.' };
    }
}

const updateMedida = async (id, body) => {
    try {
        await sequelize.models.Medidas.update({
            nombre: body.nombre
        }, {
            where: {
                id
            }
        })

        return { message: 'Medida actualizada correctamente.' };
    } catch (error) {
        console.log("ERROR AL ACTUALIZAR MEDIDA: ", error);
        return { error: 'Error al actualizar la medida.' };
    }
}

const deleteMedida = async (id) => {
    await sequelize.models.Medidas.destroy({
        where: {
            id
        }
    })
}

const medidas_services = {
    getAllMedidas,
    createMedida,
    updateMedida,
    deleteMedida
}

export { medidas_services }