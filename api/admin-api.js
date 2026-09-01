import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { getDatabase, saveDatabase } from "./database.js";

const router = express.Router();

// Session token store in memory for simplicity (since container runs single-process, this is perfect)
const activeSessions = new Set();

// Configure file storage for uploaded images and PDFs
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.resolve("./uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

// Helper to authenticate session
function requireAuth(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (authHeader && activeSessions.has(authHeader)) {
        return next();
    }
    return res.status(401).json({ error: "No autorizado. Inicie sesión nuevamente." });
}

// 1. Auth routes
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const db = getDatabase();

    if (username === "admin") {
        if (bcrypt.compareSync(password, db.config.adminPasswordHash)) {
            const token = "token_" + Math.random().toString(36).substr(2) + Date.now();
            activeSessions.add(token);
            return res.json({ token, message: "Inicio de sesión exitoso" });
        }
    }
    return res.status(401).json({ error: "Credenciales incorrectas" });
});

router.post("/change-password", requireAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const db = getDatabase();

    if (bcrypt.compareSync(currentPassword, db.config.adminPasswordHash)) {
        const salt = bcrypt.genSaltSync(10);
        db.config.adminPasswordHash = bcrypt.hashSync(newPassword, salt);
        saveDatabase(db);
        return res.json({ message: "Contraseña actualizada exitosamente" });
    }
    return res.status(400).json({ error: "Contraseña actual incorrecta" });
});

// 2. Config routes
router.get("/config", (req, res) => {
    const db = getDatabase();
    // Exclude password hash from public config
    const { adminPasswordHash, ...publicConfig } = db.config;
    res.json(publicConfig);
});

router.post("/config", requireAuth, (req, res) => {
    const db = getDatabase();
    const updates = { ...req.body };

    if (updates.fireworks) {
        db.config.fireworks = {
            ...(db.config.fireworks || {}),
            ...updates.fireworks
        };
        delete updates.fireworks;
    }

    db.config = {
        ...db.config,
        ...updates
    };
    saveDatabase(db);
    res.json({ message: "Configuración guardada", config: db.config });
});

// 3. Convocatorias routes
router.get("/convocatorias", (req, res) => {
    const db = getDatabase();
    res.json(db.convocatorias);
});

router.post("/convocatorias", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id, title, fileUrl, status, action } = req.body;

    if (action === "DELETE") {
        if (!id) return res.status(400).json({ error: "ID requerido para eliminar" });
        db.convocatorias = db.convocatorias.filter(c => c.id !== id);
        saveDatabase(db);
        return res.json({ message: "Convocatoria eliminada exitosamente", convocatorias: db.convocatorias });
    }

    if (id) {
        // Update
        const index = db.convocatorias.findIndex(c => c.id === id);
        if (index !== -1) {
            db.convocatorias[index] = { id, title, fileUrl, status };
        } else {
            return res.status(404).json({ error: "Convocatoria no encontrada" });
        }
    } else {
        // Create
        const newId = "c-" + Date.now();
        db.convocatorias.unshift({ id: newId, title, fileUrl, status: status || "vigente" });
    }

    saveDatabase(db);
    res.json({ message: "Convocatoria guardada exitosamente", convocatorias: db.convocatorias });
});

router.delete("/convocatorias/:id", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id } = req.params;

    db.convocatorias = db.convocatorias.filter(c => c.id !== id);
    saveDatabase(db);
    res.json({ message: "Convocatoria eliminada exitosamente", convocatorias: db.convocatorias });
});

// 4. Comisiones routes
router.get("/comisiones", (req, res) => {
    const db = getDatabase();
    res.json(db.comisiones);
});

router.post("/comisiones", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id, name, logo, cover, description, presidente, direccion, usuarios, area, action } = req.body;

    if (action === "DELETE") {
        if (!id) return res.status(400).json({ error: "ID requerido para eliminar" });
        db.comisiones = db.comisiones.filter(c => c.id !== id);
        saveDatabase(db);
        return res.json({ message: "Comisión eliminada exitosamente", comisiones: db.comisiones });
    }

    if (id) {
        const index = db.comisiones.findIndex(c => c.id === id);
        if (index !== -1) {
            db.comisiones[index] = { id, name, logo, cover, description, presidente, direccion, usuarios, area };
            db.comisiones.sort((a, b) => (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" }));
            saveDatabase(db);
            return res.json({ message: "Comisión actualizada con éxito", comisiones: db.comisiones });
        }
    }

    const newId = id || "comision-" + Date.now();
    db.comisiones.push({ id: newId, name, logo, cover, description, presidente, direccion, usuarios, area });
    db.comisiones.sort((a, b) => (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" }));
    saveDatabase(db);
    return res.json({ message: "Comisión creada exitosamente", comisiones: db.comisiones });
});

router.delete("/comisiones/:id", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id } = req.params;
    db.comisiones = db.comisiones.filter(c => c.id !== id);
    saveDatabase(db);
    res.json({ message: "Comisión eliminada exitosamente", comisiones: db.comisiones });
});

// 5. Avisos / Anuncios
router.get("/avisos", (req, res) => {
    const db = getDatabase();
    res.json(db.avisos);
});

router.post("/avisos", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id, title, description, imageUrl, active, action } = req.body;

    if (action === "TOGGLE_MODAL_GLOBAL" || action === "TOGGLE_MODAL") {
        const currentModalActive = db.config.modalAvisosActive !== false;
        db.config.modalAvisosActive = !currentModalActive;
        saveDatabase(db);
        return res.json({
            message: `Modal de anuncios ${!currentModalActive ? 'activado' : 'desactivado'} globalmente`,
            modalAvisosActive: db.config.modalAvisosActive,
            avisos: db.avisos
        });
    }

    if (action === "DELETE") {
        if (!id) return res.status(400).json({ error: "ID requerido para eliminar" });
        db.avisos = db.avisos.filter(a => a.id !== id);
        saveDatabase(db);
        return res.json({ message: "Anuncio eliminado exitosamente", avisos: db.avisos });
    }

    if (action === "TOGGLE_ACTIVE" || action === "TOGGLE") {
        if (!id) return res.status(400).json({ error: "ID requerido" });
        const index = db.avisos.findIndex(a => a.id === id);
        if (index !== -1) {
            const currentActive = db.avisos[index].active !== false;
            db.avisos[index].active = !currentActive;
            saveDatabase(db);
            return res.json({
                message: `Anuncio ${!currentActive ? 'activado' : 'desactivado'} exitosamente`,
                avisos: db.avisos
            });
        } else {
            return res.status(404).json({ error: "Anuncio no encontrado" });
        }
    }

    if (id) {
        const index = db.avisos.findIndex(a => a.id === id);
        if (index !== -1) {
            const currentActive = db.avisos[index].active !== undefined ? db.avisos[index].active : true;
            db.avisos[index] = {
                id,
                title,
                description,
                imageUrl,
                active: active !== undefined ? Boolean(active) : currentActive
            };
        } else {
            return res.status(404).json({ error: "Anuncio no encontrado" });
        }
    } else {
        const newId = "a-" + Date.now();
        db.avisos.push({
            id: newId,
            title,
            description,
            imageUrl,
            active: active !== undefined ? Boolean(active) : true
        });
    }

    saveDatabase(db);
    res.json({ message: "Anuncio guardado exitosamente", avisos: db.avisos });
});

router.delete("/avisos/:id", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id } = req.params;

    db.avisos = db.avisos.filter(a => a.id !== id);
    saveDatabase(db);
    res.json({ message: "Anuncio eliminado exitosamente", avisos: db.avisos });
});

// 5b. Areas routes
router.get("/areas", (req, res) => {
    const db = getDatabase();
    res.json(db.areas || []);
});

router.post("/areas", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id, title, description, icon, color, isMaterial, action } = req.body;
    if (!db.areas) db.areas = [];

    if (action === "DELETE") {
        if (!id) return res.status(400).json({ error: "ID requerido para eliminar" });
        db.areas = db.areas.filter(a => a.id !== id);
        saveDatabase(db);
        return res.json({ message: "Área eliminada exitosamente", areas: db.areas });
    }

    if (id) {
        const index = db.areas.findIndex(a => a.id === id);
        if (index !== -1) {
            db.areas[index].title = title;
            db.areas[index].description = description;
            if (icon !== undefined) db.areas[index].icon = icon;
            if (color !== undefined) db.areas[index].color = color;
            if (isMaterial !== undefined) db.areas[index].isMaterial = isMaterial;
            db.areas.sort((a, b) => (a.title || "").localeCompare(b.title || "", "es", { sensitivity: "base" }));
            saveDatabase(db);
            return res.json({ message: "Área actualizada con éxito", areas: db.areas });
        }
    }

    const newId = id || "area-" + Date.now();
    db.areas.push({
        id: newId,
        title,
        description,
        icon: icon || "bi-gear",
        color: color || "primary",
        isMaterial: isMaterial || false
    });
    db.areas.sort((a, b) => (a.title || "").localeCompare(b.title || "", "es", { sensitivity: "base" }));
    saveDatabase(db);
    return res.json({ message: "Área creada exitosamente", areas: db.areas });
});

router.delete("/areas/:id", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id } = req.params;
    if (!db.areas) db.areas = [];
    db.areas = db.areas.filter(a => a.id !== id);
    saveDatabase(db);
    res.json({ message: "Área eliminada exitosamente", areas: db.areas });
});

// 5b-2. Estructura Organizacional routes
router.get("/estructura", (req, res) => {
    const db = getDatabase();
    res.json(db.estructura || []);
});

router.post("/estructura", requireAuth, (req, res) => {
    const db = getDatabase();
    if (!db.estructura) db.estructura = [];

    const { id, code, title, badge, icon, color, items, action, estructura } = req.body;

    // Save full array if passed
    if (Array.isArray(estructura)) {
        db.estructura = estructura;
        saveDatabase(db);
        return res.json({ message: "Estructura organizacional actualizada con éxito", estructura: db.estructura });
    }

    if (action === "DELETE") {
        if (!id) return res.status(400).json({ error: "ID requerido para eliminar" });
        db.estructura = db.estructura.filter(e => e.id !== id);
        saveDatabase(db);
        return res.json({ message: "Órgano de la estructura eliminado exitosamente", estructura: db.estructura });
    }

    if (!title || !title.trim()) {
        return res.status(400).json({ error: "El título es obligatorio" });
    }

    const organoData = {
        id: id || "organo-" + Date.now(),
        code: code || "",
        title: title.trim(),
        badge: badge || "",
        icon: icon || "bi-diagram-3",
        color: color || "#20c997",
        items: Array.isArray(items) ? items : []
    };

    if (id) {
        const index = db.estructura.findIndex(e => e.id === id);
        if (index !== -1) {
            db.estructura[index] = organoData;
        } else {
            db.estructura.push(organoData);
        }
    } else {
        db.estructura.push(organoData);
    }

    saveDatabase(db);
    return res.json({ message: "Estructura organizacional guardada exitosamente", estructura: db.estructura });
});

router.delete("/estructura/:id", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id } = req.params;
    if (!db.estructura) db.estructura = [];
    db.estructura = db.estructura.filter(e => e.id !== id);
    saveDatabase(db);
    res.json({ message: "Órgano eliminado exitosamente", estructura: db.estructura });
});

// 5c. Normativas routes
router.get("/normativas", (req, res) => {
    const db = getDatabase();
    res.json(db.normativas || []);
});

router.post("/normativas", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id, title, description, action } = req.body;
    if (!db.normativas) db.normativas = [];

    if (action === "DELETE") {
        if (!id) return res.status(400).json({ error: "ID requerido para eliminar" });
        db.normativas = db.normativas.filter(n => n.id !== id);
        saveDatabase(db);
        return res.json({ message: "Normativa eliminada exitosamente", normativas: db.normativas });
    }

    if (id) {
        const index = db.normativas.findIndex(n => n.id === id);
        if (index !== -1) {
            db.normativas[index] = { id, title, description };
        } else {
            return res.status(404).json({ error: "Normativa no encontrada" });
        }
    } else {
        const newId = "n-" + Date.now();
        db.normativas.push({ id: newId, title, description });
    }

    db.normativas.sort((a, b) => (a.title || "").localeCompare(b.title || "", "es", { sensitivity: "base" }));
    saveDatabase(db);
    res.json({ message: "Normativa guardada exitosamente", normativas: db.normativas });
});

router.delete("/normativas/:id", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id } = req.params;
    if (!db.normativas) db.normativas = [];

    db.normativas = db.normativas.filter(n => n.id !== id);
    saveDatabase(db);
    res.json({ message: "Normativa eliminada exitosamente", normativas: db.normativas });
});

// 5d. Galeria Institucional routes
router.get("/galeria", (req, res) => {
    const db = getDatabase();
    res.json(db.galeria || []);
});

router.post("/galeria", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id, title, description, imageUrl, action } = req.body;
    if (!db.galeria) db.galeria = [];

    if (action === "DELETE") {
        if (!id) return res.status(400).json({ error: "ID requerido para eliminar" });
        db.galeria = db.galeria.filter(g => g.id !== id);
        saveDatabase(db);
        return res.json({ message: "Imagen eliminada de la galería exitosamente", galeria: db.galeria });
    }

    if (id) {
        const index = db.galeria.findIndex(g => g.id === id);
        if (index !== -1) {
            db.galeria[index] = { id, title, description, imageUrl };
        } else {
            return res.status(404).json({ error: "Imagen no encontrada" });
        }
    } else {
        const newId = "g-" + Date.now();
        db.galeria.push({ id: newId, title, description, imageUrl });
    }

    saveDatabase(db);
    res.json({ message: "Imagen guardada exitosamente", galeria: db.galeria });
});

router.delete("/galeria/:id", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id } = req.params;
    if (!db.galeria) db.galeria = [];

    db.galeria = db.galeria.filter(g => g.id !== id);
    saveDatabase(db);
    res.json({ message: "Imagen eliminada exitosamente", galeria: db.galeria });
});

// Helper to format YouTube URLs into embed URLs
function formatVideoUrl(url) {
    if (!url) return "";
    let formatted = url.trim();

    // If user pasted iframe HTML tag <iframe src="...">
    const iframeMatch = formatted.match(/src=["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1]) {
        formatted = iframeMatch[1];
    }

    const match = formatted.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return formatted;
}

// 5e. Videos Institucionales routes
router.get("/videos", (req, res) => {
    const db = getDatabase();
    res.json(db.videos || []);
});

router.post("/videos", requireAuth, (req, res) => {
    const db = getDatabase();
    let { id, title, description, videoUrl, category, tag, action } = req.body;
    if (!db.videos) db.videos = [];

    if (action === "DELETE") {
        if (!id) return res.status(400).json({ error: "ID requerido para eliminar" });
        db.videos = db.videos.filter(v => v.id !== id);
        saveDatabase(db);
        return res.json({ message: "Video eliminado exitosamente", videos: db.videos });
    }

    videoUrl = formatVideoUrl(videoUrl);

    if (id) {
        const index = db.videos.findIndex(v => v.id === id);
        if (index !== -1) {
            db.videos[index] = { 
                id, 
                title, 
                description, 
                videoUrl, 
                category: category || "General", 
                tag: tag || "JUSHMCHL" 
            };
        } else {
            return res.status(404).json({ error: "Video no encontrado" });
        }
    } else {
        const newId = "v-" + Date.now();
        db.videos.push({ 
            id: newId, 
            title, 
            description, 
            videoUrl, 
            category: category || "General", 
            tag: tag || "JUSHMCHL" 
        });
    }

    saveDatabase(db);
    res.json({ message: "Video guardado exitosamente", videos: db.videos });
});

router.delete("/videos/:id", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id } = req.params;
    if (!db.videos) db.videos = [];

    db.videos = db.videos.filter(v => v.id !== id);
    saveDatabase(db);
    res.json({ message: "Video eliminado exitosamente", videos: db.videos });
});

// 5f. Eventos / Calendario routes
router.get("/eventos", (req, res) => {
    const db = getDatabase();
    res.json(db.eventos || []);
});

router.post("/eventos", requireAuth, (req, res) => {
    const db = getDatabase();
    let { id, title, eventDate, date, time, location, category, color, badgeClass, label, desc, action } = req.body;
    if (!db.eventos) db.eventos = [];

    if (action === "DELETE") {
        if (!id) return res.status(400).json({ error: "ID requerido para eliminar" });
        db.eventos = db.eventos.filter(e => e.id !== id);
        saveDatabase(db);
        return res.json({ message: "Evento eliminado exitosamente", eventos: db.eventos });
    }

    if (!title || !eventDate) {
        return res.status(400).json({ error: "El título y la fecha son obligatorios." });
    }

    const dObj = new Date(eventDate + "T12:00:00");
    const year = dObj.getFullYear();
    const month = dObj.getMonth();
    const day = dObj.getDate();

    if (!date) {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        date = `${days[dObj.getDay()]}, ${String(day).padStart(2, '0')} de ${months[month]} de ${year}`;
    }

    if (!color) color = "#2563eb";
    if (!badgeClass) {
        if (color.includes("ea580c") || color.includes("orange")) badgeClass = "event-orange";
        else if (color.includes("16a34a") || color.includes("green")) badgeClass = "event-green";
        else if (color.includes("dc2626") || color.includes("red")) badgeClass = "event-red";
        else badgeClass = "event-blue";
    }

    const eventItem = {
        id: id || ("e-" + Date.now()),
        day,
        month,
        year,
        eventDate,
        title,
        date,
        time: time || "Todo el día",
        location: location || "Sede Principal",
        category: category || "General",
        color,
        badgeClass,
        label: label || category || "Evento",
        desc: desc || ""
    };

    if (id) {
        const index = db.eventos.findIndex(e => e.id === id);
        if (index !== -1) {
            db.eventos[index] = eventItem;
        } else {
            db.eventos.push(eventItem);
        }
    } else {
        db.eventos.push(eventItem);
    }

    saveDatabase(db);
    res.json({ message: "Evento guardado exitosamente", eventos: db.eventos });
});

router.delete("/eventos/:id", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id } = req.params;
    if (!db.eventos) db.eventos = [];

    db.eventos = db.eventos.filter(e => e.id !== id);
    saveDatabase(db);
    res.json({ message: "Evento eliminado exitosamente", eventos: db.eventos });
});

// 5g. Diagnostico routes
router.get("/diagnostico", (req, res) => {
    const db = getDatabase();
    res.json(db.diagnostico || {});
});

router.post("/diagnostico", requireAuth, (req, res) => {
    const db = getDatabase();
    const { title, subtitle, descripcionNegocio, coreBusiness, diagnosticoInterno, diagnosticoExterno } = req.body;

    db.diagnostico = {
        title: title || "2. DIAGNÓSTICO DE LA JUSHMCHL",
        subtitle: subtitle || "Análisis integral del modelo de negocio, core business y diagnóstico interno y externo institucional.",
        descripcionNegocio: descripcionNegocio || {
            intro: "",
            funciones: []
        },
        coreBusiness: coreBusiness || "",
        diagnosticoInterno: diagnosticoInterno || "",
        diagnosticoExterno: diagnosticoExterno || ""
    };

    saveDatabase(db);
    res.json({ message: "Diagnóstico institucional actualizado exitosamente", diagnostico: db.diagnostico });
});

// 5h. Noticias routes
router.get("/noticias", (req, res) => {
    const db = getDatabase();
    res.json(db.noticias || []);
});

router.post("/noticias", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id, title, category, date, summary, imageUrl, action } = req.body;
    if (!db.noticias) db.noticias = [];

    if (action === "DELETE") {
        if (!id) return res.status(400).json({ error: "ID requerido para eliminar" });
        db.noticias = db.noticias.filter(n => n.id !== id);
        saveDatabase(db);
        return res.json({ message: "Noticia eliminada exitosamente", noticias: db.noticias });
    }

    const newItem = {
        id: id || ("n-" + Date.now()),
        title: title || "",
        category: category || "Institucional",
        date: date || new Date().toLocaleDateString("es-PE"),
        summary: summary || "",
        imageUrl: imageUrl || ""
    };

    if (id) {
        const index = db.noticias.findIndex(n => n.id === id);
        if (index !== -1) {
            db.noticias[index] = newItem;
        } else {
            db.noticias.unshift(newItem);
        }
    } else {
        db.noticias.unshift(newItem);
    }

    saveDatabase(db);
    res.json({ message: "Noticia guardada exitosamente", noticias: db.noticias });
});

router.delete("/noticias/:id", requireAuth, (req, res) => {
    const db = getDatabase();
    const { id } = req.params;
    if (!db.noticias) db.noticias = [];

    db.noticias = db.noticias.filter(n => n.id !== id);
    saveDatabase(db);
    res.json({ message: "Noticia eliminada exitosamente", noticias: db.noticias });
});

// 6. File upload endpoint
router.post("/upload", requireAuth, upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se subió ningún archivo" });
    }
    const relativePath = `/uploads/${req.file.filename}`;
    res.json({ message: "Archivo subido correctamente", fileUrl: relativePath });
});

export default router;
