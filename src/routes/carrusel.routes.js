import express from "express";
import { tokenExtractorMiddleware } from "../middlewares/token-extractor-middleware.js";

const router = express.Router();
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

// solamente el o los administrador/es del sistema (logueados) van a poder subir una foto al carrusel si es necesario. ANDA
router.post("/upload", tokenExtractorMiddleware, upload.single('file'),async (req, res, next) => {
    try {
        console.log("archivo en carrusel: ", req.file)
        // la foto es obligaria
        const fileBuffer = req.file.buffer;
        const filename = Date.now() + '-' + req.file.originalname;

        // Referencia al bucket de almacenamiento
        const storageRef = ref(storage, `carrusel/${filename}`);

        // Subir el archivo al bucket
        await uploadBytes(storageRef, fileBuffer);

        // Obtener la URL del archivo recién subido
        const url = await getDownloadURL(storageRef);
        req.body.foto = url;

        return res.json({ message: "Foto subida al carrusel con éxito", url });
    } catch (error) {
        next(error)
    }
})

// solamente el o los administrador/es del sistema (logueados) van a poder borrar una foto del carrusel si es necesario. ANDA
router.delete("/delete/img", tokenExtractorMiddleware, async (req, res, next) => {
    try {
        const { src } = req.body;
        // Obtener la referencia al archivo en el storage de Firebase
        const fileRef = ref(storage, src);

        // Borrar el archivo del storage de Firebase
        await deleteObject(fileRef);

        return res.json({ message: "Foto borrada del carrusel con éxito" });
    } catch (error) {
        next(error);
    }
});

// obtener todas las URLs de las fotos en la carpeta carrusel. ANDA
router.get("/images/urls", async (req, res, next) => {
    try {
        // Obtener la referencia a la carpeta carrusel en el storage de Firebase
        const carruselRef = ref(storage, "carrusel");

        // Obtener la lista de archivos en la carpeta carrusel
        const fileList = await listAll(carruselRef);

        // Obtener las URLs de los archivos en la carpeta carrusel
        const urls = await Promise.all(fileList.items.map(async (fileRef) => {
            return getDownloadURL(fileRef);
        }));

        return res.json(urls);
    } catch (error) {
        next(error);
    }
});

const carrusel_router = { router }
export {carrusel_router}