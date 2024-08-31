import express, { response } from "express";
import { tokenExtractorMiddleware } from "../middlewares/token-extractor-middleware.js";
import { subcategorias_productos_services } from "../services/subcategorias_productos.service.js";
const router = express.Router();

// solamente el o los administrador/es del sistema (logueados) van a poder ver a las subcategorias registradas si es necesario
router.get("/", async (req, res, next) => {
    try {
        const response = await subcategorias_productos_services.getAll();
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

// solamente el o los administrador/es del sistema (logueados) van a poder crear una nueva subcategoria si es necesario. ANDA
router.post("/", tokenExtractorMiddleware, async (req, res, next) => {
    try {
        const response = await subcategorias_productos_services.createSubCategoria(req.body);
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

// solamente el o los administrador/es del sistema (logueados) van a poder modificar una subcategoria si es necesario. ANDA
router.put("/:id", tokenExtractorMiddleware, async (req, res, next) => {
    try {
        const response = await subcategorias_productos_services.editSubCategoria(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

// solamente el o los administrador/es del sistema (logueados) van a poder eliminar una subcategoria si es necesario. CORREGIR
router.delete("/:id", tokenExtractorMiddleware, async (req, res, next) => {
    try {
        const response = await subcategorias_productos_services.deleteSubCategoria(req.params.id);
        return res.json(response);
    } catch (error) {
        console.log(error)
        next(error)
    }
})

const subcategorias_productos_router = { router }
export { subcategorias_productos_router }