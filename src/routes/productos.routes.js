import express from "express";
import { tokenExtractorMiddleware } from "../middlewares/token-extractor-middleware.js";

const router = express.Router();
import multer from "multer"; // para gestionar el archivo a subir a firebase

// configurar firebase e inicializarlo
// Importa las funciones necesarias de los SDKs que necesitas
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { productos_services } from "../services/productos.service.js";
import { fotos_productos_services } from "../services/fotos_productos.service.js";
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

// solamente el o los administrador/es del sistema (logueados) van a poder subir una foto al carrusel si es necesario. ANDA
router.post("/upload", tokenExtractorMiddleware, upload.array('files', 3), async (req, res, next) => {
  try {

    // el resto de los datos del producto

    // medidas: [1,2,3]
    const { nombre, precio, idSubCategoria, descripcion, medidas } = JSON.parse(req.body.data);
    const product = {
        nombre,
        precio,
        idSubCategoria,
        descripcion,
        medidas
    };

    req.body = {...product};

    const producto = await productos_services.createProducto(req.body);
    const idProducto = producto.id;

    let urls = []

    // si hay fotos, las subo al storage
    if (req.files) {
      urls = await Promise.all(req.files.map(async (file) => {
        const fileBuffer = file.buffer;
        const filename = Date.now() + '-' + file.originalname;
    
        // Referencia al bucket de almacenamiento
        const storageRef = ref(storage, `productos/${idProducto}/${filename}`);
    
        // Subir el archivo al bucket
        await uploadBytes(storageRef, fileBuffer);
    
        // Obtener la URL del archivo recién subido
        return await getDownloadURL(storageRef);
      }));

      if (urls.length > 0) {
        await Promise.all(urls.map(async (url) => {
          await fotos_productos_services.createFotoProducto({ url, idProducto });
        }));
      }

      return res.status(201).json({ message: 'Producto creado con éxito' });
    }
  } catch (error) {
      next(error)
  }
})

// todos pueden ver la seccion productos
router.get("/", async (req, res, next) => {
  try {
    const productos = await productos_services.getSeccionProductos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
})

// solamente el o los administrador/es del sistema (logueados) van a poder borrar un producto si es necesario. ANDA
router.delete("/:id", tokenExtractorMiddleware, async (req, res, next) => {
  try {

      // codigo para borrar los archivos de firebase cuando se borra un producto
      const fotos = await sequelize.models.Fotos_Productos.findAll({
          where: {
              idProducto: req.params.id
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

      await fotos_productos_services.delete_fotos_producto(req.params.id);

      

      const response = await productos_services.deleteProducto(req.params.id);
      return res.json(response);
  } catch (error) {
      next(error)
  }
})

// solamente el o los administrador/es del sistema (logueados) van a poder modificar un producto si es necesario. ANDA
router.put("/:id", tokenExtractorMiddleware, upload.array('files', 3), async (req, res, next) => {
  try {
    // el resto de los datos del producto
    const { nombre, precio, idSubCategoria, descripcion, nuevasMedidas } = JSON.parse(req.body.data);
    const product = {
        nombre,
        precio,
        idSubCategoria,
        descripcion,
        nuevasMedidas
    };

    req.body = {...product};

    // si hay archivos se ejecuta todo esto
    console.log("req.files: ", req.files)
    if (req.files.length > 0) {
        // codigo para borrar los archivos de firebase cuando se edita un producto
      const fotos = await sequelize.models.Fotos_Productos.findAll({
          where: {
              idProducto: req.params.id
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

      await fotos_productos_services.delete_fotos_producto(req.params.id);

      let urls = []

      // si hay fotos en la actualizacion, las subo al storage
      if (req.files) {
        urls = await Promise.all(req.files.map(async (file) => {
          const fileBuffer = file.buffer;
          const filename = Date.now() + '-' + file.originalname;
      
          // Referencia al bucket de almacenamiento
          const storageRef = ref(storage, `productos/${req.params.id}/${filename}`);
      
          // Subir el archivo al bucket
          await uploadBytes(storageRef, fileBuffer);
      
          // Obtener la URL del archivo recién subido
          return await getDownloadURL(storageRef);
        }));

        if (urls.length > 0) {
          await Promise.all(urls.map(async (url) => {
            await fotos_productos_services.createFotoProducto({ url, idProducto: req.params.id });
          }));
        }
      }
    }

    // Por ultimo actualizo el producto
    const response = await productos_services.updateProducto(req.params.id, req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
})

// todos pueden ver detalle de un producto
router.get("/:id", async (req, res, next) => {
  try {
    const producto = await productos_services.getProductoById(req.params.id);
    res.json(producto);
  } catch (error) {
    next(error);
  }
})

const productos_router = { router }
export { productos_router }