import { sequelize } from "../databases/databases.js";
import { categorias_productos_services } from "./categorias_productos.service.js";
import { fotos_productos_services } from "./fotos_productos.service.js";
import { productos_services } from "./productos.service.js";

import multer from "multer"; // para gestionar el archivo a subir a firebase

// configurar firebase e inicializarlo
// Importa las funciones necesarias de los SDKs que necesitas
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB0Hb5XWfV1p9bId_zCd5GkAFyUztJqqwE",
  authDomain: "cardelli-neumaticos.firebaseapp.com",
  projectId: "cardelli-neumaticos",
  storageBucket: "cardelli-neumaticos.appspot.com",
  messagingSenderId: "999381533436",
  appId: "1:999381533436:web:b343dcae581149babe0d79",
  measurementId: "G-BWBQTHGR4X"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Configuración de multer
const storageMulter = multer.memoryStorage();
const upload = multer({ storage: storageMulter });

// Crear una subcategoria
// body = {nombre: "nombre de la subcategoria", idCategoriaProducto: 2}
const createSubCategoria = async (body) => {

    // valido si existe la categoria asociada antes de crear una subcategoria
    const categoria = await categorias_productos_services.getById(body.idCategoriaProducto);
    if (!categoria) return { error: "No existe esa categoria" };

    try {
        const createdSubCategoria = await sequelize.models.SubCategorias_Productos.create({
            nombre: body.nombre,
            idCategoriaProducto: body.idCategoriaProducto
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
    const subCategoriaAActualizar = await sequelize.models.SubCategorias_Productos.findByPk(idSubCategoria);
    if (!subCategoriaAActualizar) return { error: "No existe esa subcategoria" };

    subCategoriaAActualizar.nombre = body.nombre;
    await subCategoriaAActualizar.save();
}

// Borrar una subcategoria
// aca no hay body, solo el id de la subcategoria
const deleteSubCategoria = async (idSubCategoria) => {
    const subCategoriaABorrar = await sequelize.models.SubCategorias_Productos.findByPk(idSubCategoria);
    if (!subCategoriaABorrar) return {error: "No existe esa subcategoria"}

    const productos = await sequelize.models.Productos.findAll({
        where: {
            idSubCategoria: idSubCategoria
        }
    })

    // si tiene productos asociados borra los productos y las fotos asociadas
    if (productos.length > 0) {
        await Promise.all(productos.map(async (producto) => {
            // codigo para borrar los archivos de firebase cuando se borra un producto
            const fotos = await sequelize.models.Fotos_Productos.findAll({
                where: {
                    idProducto: producto.id
                }
            })

            if (fotos.length > 0) {
                await Promise.all(fotos.map(async (foto) => {
                    // Extraer la parte relevante de la URL
                    const url = new URL(foto.url);
                    const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
        
                    const storageRef = ref(storage, path);
                    await deleteObject(storageRef);
                }));
            }

            await fotos_productos_services.delete_fotos_producto(producto.id);
            await productos_services.deleteProducto(producto.id);
        }))
    }
    await subCategoriaABorrar.destroy();
    return { message: "Subcategoria eliminada" };
}

// obtener todas las subcategorias
const getAll = async () => {
    const subcategorias = await sequelize.models.SubCategorias_Productos.findAll()
    return subcategorias.map(subcategoria => subcategoria.dataValues)
}

// para validar la existencia de una subcategoria al crear un nuevo producto o editar uno existente
const getById = async (id) => {
    const subcategoria = await sequelize.models.SubCategorias_Productos.findByPk(id);
    if (!subcategoria) return { error: "No existe esa subcategoria" };
    return subcategoria;
}

const subcategorias_productos_services = { createSubCategoria, editSubCategoria, deleteSubCategoria, getAll, getById }
export { subcategorias_productos_services }