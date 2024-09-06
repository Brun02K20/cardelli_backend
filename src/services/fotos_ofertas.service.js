import { sequelize } from "../databases/databases.js";

const createFotoOferta = async (body) => {
    try {
        const createdFotoOferta = await sequelize.models.Fotos_Ofertas.create({
            url: body.url,
            idOferta: body.idOferta
        })

        return createdFotoOferta.dataValues
    } catch (error) {
        // Manejar otros errores
        console.log("ERROR AL CREAR FOTO DE LA OFERTA: ", error);
        return { error: 'Error al crear la foto de la oferta.' };
    }
}

const delete_fotos_oferta = async (idOferta) => {
    await sequelize.models.Fotos_Ofertas.destroy({
        where: {
            idOferta
        }
    })
}

const fotos_ofertas_services = {
    createFotoOferta,
    delete_fotos_oferta
}

export { fotos_ofertas_services }