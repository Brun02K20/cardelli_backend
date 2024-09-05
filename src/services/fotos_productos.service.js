import { sequelize } from "../databases/databases.js";

const createFotoProducto = async (body) => {
    try {
        const createdFotoProducto = await sequelize.models.Fotos_Productos.create({
            url: body.url,
            idProducto: body.idProducto
        })

        return createdFotoProducto.dataValues
    } catch (error) {
        // Manejar otros errores
        console.log("ERROR AL CREAR FOTO DEL PRODUCTO: ", error);
        return { error: 'Error al crear la foto del producto.' };
    }
}

const delete_fotos_producto = async (idProducto) => {
    await sequelize.models.Fotos_Productos.destroy({
        where: {
            idProducto
        }
    })
}

const fotos_productos_services = {
    createFotoProducto,
    delete_fotos_producto
}

export { fotos_productos_services }