import { sequelize } from "../databases/databases.js";
import { subcategorias_ofertas_services } from "./subcategorias_ofertas.service.js";

// Crear una categoria
// body = {nombre: "nombre de la categoria"}
const createCategoria = async (body) => {
    try {
        const createdCategoria = await sequelize.models.Categorias_Ofertas.create({
            nombre: body.nombre
        })

        return createdCategoria.dataValues
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') { // si viola las restricciones UNIQUE de nombre de categoria
            // Manejar el error de restricción única
            return { error: 'Ya existe una categoria con ese nombre' };
        } else {
            // Manejar otros errores
            console.log("ERROR AL CREAR CATEGORIA: ", error);
            return { error: 'Error al crear la categoria.' };
        }
    }
}

// Editar una categoria
// body = {nombre: "nombre nuevo de la categoria"}
const editCategoria = async (idCategoria, body) => {
    const categoriaAActualizar = await sequelize.models.Categorias_Ofertas.findByPk(idCategoria);
    if (!categoriaAActualizar) return { error: "No existe esa categoria" };

    categoriaAActualizar.nombre = body.nombre;
    await categoriaAActualizar.save();
}

// Borrar una categoria
// aca no hay body, solo el id de la categoria
const deleteCategoria = async (idCategoria) => {
    const categoriaABorrar = await sequelize.models.Categorias_Ofertas.findByPk(idCategoria);
    if (!categoriaABorrar) return { error: "No existe esa categoria" };

    const subcategorias = await sequelize.models.SubCategorias_Ofertas.findAll({
        where: {
            idCategoriaOferta: idCategoria
        }
    })

    // si tiene subcategorias asociadas borra las subcategorias
    if (subcategorias.length > 0) {
        await Promise.all(subcategorias.map(async (subcategoria) => {
            await subcategorias_ofertas_services.deleteSubCategoria(subcategoria.id);
        }))
    }

    await categoriaABorrar.destroy();
    return { message: "Categoria eliminada" };
}

// obtener todas las categorias, esto es de prueba, no se implementa realmente en el proyecto
const getAll = async () => {
    const categorias = await sequelize.models.Categorias_Ofertas.findAll()
    return categorias.map(categoria => categoria.dataValues)
}   

// para validacion con una nueva subcategoria a crear: 
const getById = async (id) => {
    const categoria = await sequelize.models.Categorias_Ofertas.findByPk(id);
    if (!categoria) return null;
    return categoria;
}


const categorias_ofertas_services = { createCategoria, editCategoria, deleteCategoria, getAll, getById }
export { categorias_ofertas_services }