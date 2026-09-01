import express from "express";
import facebookHandler from "./api/facebook.js";
import adminRouter from "./api/admin-api.js";

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads directory statically
app.use("/uploads", express.static("./uploads"));

// Webhook endpoint
app.get("/webhooks/facebook", (req, res) => {
    const VERIFY_TOKEN = "Romacix_token";

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("✅ Webhook verificado correctamente");
            res.status(200).send(challenge);
        } else {
            res.status(403).send("Token inválido");
        }
    } else {
        res.status(400).send("Faltan parámetros");
    }
});

// Facebook API endpoint
app.all("/api/facebook", facebookHandler);

// Admin API endpoints
app.use("/api/admin", adminRouter);

// Forward php-api calls to adminRouter in Node preview
app.use("/php-api/:file", (req, res, next) => {
    const file = req.params.file.replace('.php', '');
    req.url = '/' + file;
    return adminRouter(req, res, next);
});

// Serve static files from the root directory
app.use(express.static(".", { extensions: ["html"] }));

app.listen(3000, "0.0.0.0", () => console.log("Servidor activo en el puerto 3000"));

