import app from "./app.js";

const PORT = process.env.PORT || 4001;

app.get("/", (req, res) => {
    const htmlResponse = '<html><head><title>ARRE-Backend</title></head><body>FUNCOOOO, VAMO RIVEEEEEER</body></html>';
    res.send(htmlResponse);
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en: http://localhost:${PORT}`);
});

export default app;