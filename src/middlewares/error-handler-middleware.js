import { ResourceNotFound } from "../errors/resource-not-found-error.js";
import { ValidationError } from "sequelize";
import jwt from 'jsonwebtoken';

// middleware para manejo de errores basicos como un 500 si existe un error del lado del servidor o un error de restricciones en base de datos (400)
const errorHandler = (error, req, res, next) => {
    if (error instanceof ResourceNotFound) {
        return res.status(error.status).json({ error: error.message });
    }

    if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
    }

    if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature') {
        // console.log("ENTRO AL ERROR DE FIRMA INVALIDA");
        return res.status(401).json({ error: "TOKEN CON FIRMA INCORRECTA." });
    } else if (error instanceof jwt.JsonWebTokenError && error.message === 'jwt must be provided') {
        return res.status(401).json({ error: "TOKEN NO HA SIDO PROVISTO" })
    } else if (error.name === "TokenExpiredError") {
        // console.log("ENTRO AL ERROR DE TOKEN VENCIDO");
        return res.status(401).json({ error: "TOKEN VENCIDO." });
    }

    console.log("NO FUE NINGUNO DE LOS ANTERIORES: ", error);
    return res.status(500).json({ error: 'Error imprevisto.' });
};

export default errorHandler;