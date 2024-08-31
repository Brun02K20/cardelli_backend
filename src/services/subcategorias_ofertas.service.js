import { sequelize } from "../databases/databases.js";
import { categorias_ofertas_services } from "./categorias_ofertas.service.js";

// Crear una subcategoria
// body = {nombre: "nombre de la subcategoria", idCategoriaOferta: 2}
const createSubCategoria = async (body) => {

    // valido si existe la categoria asociada antes de crear una subcategoria
    const categoria = await categorias_ofertas_services.getById(body.idCategoriaOferta);
    if (!categoria) return { error: "No existe esa categoria" };

    try {
        const createdSubCategoria = await sequelize.models.SubCategorias_Ofertas.create({
            nombre: body.nombre,
            idCategoriaOferta: body.idCategoriaOferta
        })

        return createdSubCategoria.dataValues
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') { // si viola las restricciones UNIQUE de nombre de subcategoria
            // Manejar el error de restricción única
            return { error: 'Ya existe una subcategoria con ese nombre' };
        } else {
            // Manejar otros errores
            console.log("ERROR AL CREAR SUBCATEGORIA: ", error);
            return { error: 'Error al crear la subcategoria.' };
        }
    }
}

// Editar una subcategoria
// body = {nombre: "nombre nuevo de la subcategoria"}
const editSubCategoria = async (idSubCategoria, body) => {
    const subCategoriaAActualizar = await sequelize.models.SubCategorias_Ofertas.findByPk(idSubCategoria);
    if (!subCategoriaAActualizar) return { error: "No existe esa subcategoria" };

    subCategoriaAActualizar.nombre = body.nombre;
    await subCategoriaAActualizar.save();
}

// Borrar una subcategoria
// aca no hay body, solo el id de la subcategoria
const deleteSubCategoria = async (idSubCategoria) => {
    const subCategoriaABorrar = await sequelize.models.SubCategorias_Ofertas.findByPk(idSubCategoria);
    if (!subCategoriaABorrar) return {error: "No existe esa subcategoria"}

    await subCategoriaABorrar.destroy();
    return { message: "Subcategoria eliminada" };
}

// obtener todas las subcategorias
const getAll = async () => {
    const subcategorias = await sequelize.models.SubCategorias_Ofertas.findAll()
    return subcategorias.map(subcategoria => subcategoria.dataValues)
}

// para validar la existencia de una subcategoria al crear un nuevo producto o editar uno existente
const getById = async (id) => {
    const subcategoria = await sequelize.models.SubCategorias_Ofertas.findByPk(id);
    if (!subcategoria) return { error: "No existe esa subcategoria" };
    return subcategoria;
}

const subcategorias_ofertas_services = { createSubCategoria, editSubCategoria, deleteSubCategoria, getAll, getById }
export { subcategorias_ofertas_services }