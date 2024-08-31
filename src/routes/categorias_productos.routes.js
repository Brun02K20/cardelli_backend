import express from "express";
import { tokenExtractorMiddleware } from "../middlewares/token-extractor-middleware.js";
import { categorias_productos_services } from "../services/categorias_productos.service.js";
const router = express.Router();

// solamente el o los administrador/es del sistema (logueados) van a poder ver a las categorias registradas si es necesario
router.get("/", async (req, res, next) => {
    try {
        const response = await categorias_productos_services.getAll();
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

// solamente el o los administrador/es del sistema (logueados) van a poder crear una nueva categoria si es necesario. ANDA
router.post("/", tokenExtractorMiddleware, async (req, res, next) => {
    try {
        const response = await categorias_productos_services.createCategoria(req.body);
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

// solamente el o los administrador/es del sistema (logueados) van a poder modificar una categoria si es necesario. ANDA
router.put("/:id", tokenExtractorMiddleware, async (req, res, next) => {
    try {
        const response = await categorias_productos_services.editCategoria(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

// solamente el o los administrador/es del sistema (logueados) van a poder eliminar una categoria si es necesario. ANDA
router.delete("/:id", tokenExtractorMiddleware, async (req, res, next) => {
    try {
        const response = await categorias_productos_services.deleteCategoria(req.params.id);
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

const categorias_productos_router = { router }
export { categorias_productos_router }
