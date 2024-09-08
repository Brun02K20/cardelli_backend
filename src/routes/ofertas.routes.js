import express from "express";
import { tokenExtractorMiddleware } from "../middlewares/token-extractor-middleware.js";

const router = express.Router();
import multer from "multer"; // para gestionar el archivo a subir a firebase

// configurar firebase e inicializarlo
// Importa las funciones necesarias de los SDKs que necesitas
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { ofertas_services } from "../services/ofertas.service.js"; 
import { fotos_ofertas_services } from "../services/fotos_ofertas.service.js"; 
import { sequelize } from "../databases/databases.js";

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

// solamente el o los administrador/es del sistema (logueados) van a poder subir una foto a la oferta si es necesario. ANDA
router.post("/upload", tokenExtractorMiddleware, upload.array('files', 3), async (req, res, next) => {
  try {

    // el resto de los datos de la oferta

    // medidas: [1,2,3]
    const { nombre, precioSinOferta, precioConOferta, idSubCategoria, descripcion, medidas } = JSON.parse(req.body.data);
    const ofert = {
        nombre,
        precioSinOferta,
        precioConOferta,
        idSubCategoria,
        descripcion,
        medidas
    };

    req.body = {...ofert};

    const oferta = await ofertas_services.createOferta(req.body)
    const idOferta = oferta.id;

    let urls = []

    // si hay fotos, las subo al storage
    if (req.files) {
      urls = await Promise.all(req.files.map(async (file) => {
        const fileBuffer = file.buffer;
        const filename = Date.now() + '-' + file.originalname;
    
        // Referencia al bucket de almacenamiento
        const storageRef = ref(storage, `ofertas/${idOferta}/${filename}`);
    
        // Subir el archivo al bucket
        await uploadBytes(storageRef, fileBuffer);
    
        // Obtener la URL del archivo recién subido
        return await getDownloadURL(storageRef);
      }));

      if (urls.length > 0) {
        await Promise.all(urls.map(async (url) => {
          await fotos_ofertas_services.createFotoOferta({ url, idOferta });
        }));
      }

      return res.status(201).json({ message: 'Oferta creada con éxito' });
    }
  } catch (error) {
      next(error)
  }
})

// todos pueden ver la seccion ofertas
router.get("/", async (req, res, next) => {
  try {
    const ofertas = await ofertas_services.getSeccionOfertas();
    res.json(ofertas);
  } catch (error) {
    next(error);
  }
})

// solamente el o los administrador/es del sistema (logueados) van a poder borrar una oferta si es necesario. ANDA
router.delete("/:id", tokenExtractorMiddleware, async (req, res, next) => {
  try {

      // codigo para borrar los archivos de firebase cuando se borra un producto
      const fotos = await sequelize.models.Fotos_Ofertas.findAll({
          where: {
              idOferta: req.params.id
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

      await fotos_ofertas_services.delete_fotos_oferta(req.params.id);
      const response = await ofertas_services.deleteOferta(req.params.id);
      return res.json(response);
  } catch (error) {
      next(error)
  }
})

// solamente el o los administrador/es del sistema (logueados) van a poder modificar un producto si es necesario. ANDA
router.put("/:id", tokenExtractorMiddleware, upload.array('files', 3), async (req, res, next) => {
  try {
    // el resto de los datos del producto
    const { nombre, precioSinOferta, precioConOferta, idSubCategoria, descripcion, nuevasMedidas } = JSON.parse(req.body.data);
    const ofert = {
        nombre,
        precioSinOferta,
        precioConOferta,
        idSubCategoria,
        descripcion,
        nuevasMedidas
    };

    req.body = {...ofert};

    // si hay archivos se ejecuta todo esto
    console.log("req.files: ", req.files)
    if (req.files.length > 0) {
        // codigo para borrar los archivos de firebase cuando se edita un producto
      const fotos = await sequelize.models.Fotos_Ofertas.findAll({
          where: {
              idOferta: req.params.id
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

      await fotos_ofertas_services.delete_fotos_oferta(req.params.id);

      let urls = []

      // si hay fotos en la actualizacion, las subo al storage
      if (req.files) {
        urls = await Promise.all(req.files.map(async (file) => {
          const fileBuffer = file.buffer;
          const filename = Date.now() + '-' + file.originalname;
      
          // Referencia al bucket de almacenamiento
          const storageRef = ref(storage, `ofertas/${req.params.id}/${filename}`);
      
          // Subir el archivo al bucket
          await uploadBytes(storageRef, fileBuffer);
      
          // Obtener la URL del archivo recién subido
          return await getDownloadURL(storageRef);
        }));

        if (urls.length > 0) {
          await Promise.all(urls.map(async (url) => {
            await fotos_ofertas_services.createFotoOferta({ url, idOferta: req.params.id });
          }));
        }
      }
    }

    // Por ultimo actualizo la oferta
    const response = await ofertas_services.updateOferta(req.params.id, req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
})

// todos pueden ver el detalle de una oferta
router.get("/:id", async (req, res, next) => {
  try {
    const oferta = await ofertas_services.getOfertaById(req.params.id);
    res.json(oferta);
  } catch (error) {
    next(error);
  }
})


const ofertas_router = { router }
export { ofertas_router }