import express from "express";
import { tokenExtractorMiddleware } from "../middlewares/token-extractor-middleware.js";

const router = express.Router();
import { medidas_services } from "../services/medidas.service.js";

// solamente el o los administrador/es del sistema (logueados) van a poder ver a las medidas registradas si es necesario
router.get("/", async (req, res, next) => {
    try {
        const response = await medidas_services.getAllMedidas();
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

// solamente el o los administrador/es del sistema (logueados) van a poder crear una nueva medida si es necesario. ANDA
router.post("/", tokenExtractorMiddleware, async (req, res, next) => {
    try {
        const response = await medidas_services.createMedida(req.body);
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

// solamente el o los administrador/es del sistema (logueados) van a poder modificar una medida si es necesario. ANDA
router.put("/:id", tokenExtractorMiddleware, async (req, res, next) => {
    try {
        const response = await medidas_services.updateMedida(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        next(error)
    }
})

// solamente el o los administrador/es del sistema (logueados) van a poder eliminar una medida si es necesario. CORREGIR
router.delete("/:id", tokenExtractorMiddleware, async (req, res, next) => {
    try {
        const response = await medidas_services.deleteMedida(req.params.id);
        return res.json(response);
    } catch (error) {
        console.log(error)
        next(error)
    }
})

const medidas_router = { router }
export { medidas_router }
