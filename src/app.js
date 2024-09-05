// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyB0Hb5XWfV1p9bId_zCd5GkAFyUztJqqwE",
//   authDomain: "cardelli-neumaticos.firebaseapp.com",
//   projectId: "cardelli-neumaticos",
//   storageBucket: "cardelli-neumaticos.appspot.com",
//   messagingSenderId: "999381533436",
//   appId: "1:999381533436:web:b343dcae581149babe0d79",
//   measurementId: "G-BWBQTHGR4X"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error-handler-middleware.js";
import { usuarios_router } from "./routes/usuarios.routes.js";
import { carrusel_router } from "./routes/carrusel.routes.js";
import { categorias_productos_router } from "./routes/categorias_productos.routes.js";
import { categorias_ofertas_router } from "./routes/categorias_ofertas.routes.js";
import { subcategorias_productos_router } from "./routes/subcategorias_productos.routes.js";
import { subcategorias_ofertas_router } from "./routes/subcategorias_ofertas.routes.js";
import { productos_router } from "./routes/productos.routes.js";
// creando la aplicacion express
const app = express();
app.use(express.json());
app.use(cors()); // configurando cors para que un cliente frontend pueda hacer peticiones a la api

app.use("/api/cardelli/usuarios", usuarios_router.router);
app.use("/api/cardelli/carrusel", carrusel_router.router);
app.use("/api/cardelli/categorias_productos", categorias_productos_router.router);
app.use("/api/cardelli/categorias_ofertas", categorias_ofertas_router.router);
app.use("/api/cardelli/subcategorias_productos", subcategorias_productos_router.router);
app.use("/api/cardelli/subcategorias_ofertas", subcategorias_ofertas_router.router);
app.use("/api/cardelli/productos", productos_router.router);

app.use(errorHandler)

export default app;