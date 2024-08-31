import { tokenExtractorMiddleware } from "../middlewares/token-extractor-middleware.js";
import { usuarios_services } from "../services/usuarios.service.js";
import express from "express";
const router = express.Router();

// solamente el o los administrador/es del sistema (logueados) van a poder ver a los usuarios registrados si es necesario
router.get("/", tokenExtractorMiddleware ,async (req, res, next) => {
    try {
        const response = await usuarios_services.getAll();
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

// solamente el o los administrador/es del sistema (logueados) van a poder crear un nuevo usuario si es necesario
router.post("/", async (req, res, next) => {
    try {
        const response = await usuarios_services.createUsuario(req.body);
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

// en este endpoint se va a poder loguear un usuario y recibir un token de autenticacion
router.post("/login", async (req, res, next) => {
    try {
        const response = await usuarios_services.login(req.body);
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

const usuarios_router = { router}
export { usuarios_router }