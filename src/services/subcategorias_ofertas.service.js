import { sequelize } from "../databases/databases.js";
import { categorias_ofertas_services } from "./categorias_ofertas.service.js";
import { fotos_ofertas_services } from "./fotos_ofertas.service.js";
import { ofertas_services } from "./ofertas.service.js";

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

    const ofertas = await sequelize.models.Ofertas.findAll({
        where: {
            idSubCategoria: idSubCategoria
        }
    })

    // si tiene ofertas asociadas borra las ofertas y las fotos asociadas
    if (ofertas.length > 0) {
        await Promise.all(ofertas.map(async (oferta) => {
            // codigo para borrar los archivos de firebase cuando se borra una oferta
            const fotos = await sequelize.models.Fotos_Ofertas.findAll({
                where: {
                    idOferta: oferta.id
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

            await fotos_ofertas_services.delete_fotos_oferta(oferta.id);
            await ofertas_services.deleteOferta(oferta.id);
        }))
    }

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