import jwt from 'jsonwebtoken';

const tokenExtractorMiddleware = async (req, res, next) => {
    const authorization = req.get("authorization"); // obtengo el encabezado de autenticacion
    let token = "";
    if (authorization && authorization.toLowerCase().startsWith("bearer")) { // si existe y es de esquema bearer
        token = authorization.substring(7);
    }

    console.log("TOKEN EN EL MIDDLEWARE DE EXTRACCION: ", token);

    let decodedToken = {};
    try {
        decodedToken = jwt.verify(token, "poronga"); // valido la firma
        console.log("TOKEN DECODIFICADO: ", decodedToken);
        req.decodedToken = decodedToken; // Guardamos el token decodificado en el objeto de solicitud para que esté disponible en los controladores posteriores.
        req.token = token
        next(); // Pasamos al siguiente middleware o controlador. Que va a ser el endpoint si esta todo OK
    } catch (error) {
        console.log("ENTRO AL CATCH DE ERRORES GLOBAL");
        next(error); // Pasamos el error al siguiente middleware de manejo de errores. EN mi caso, el errorHandlerMiddleware
    }
};

export { tokenExtractorMiddleware }