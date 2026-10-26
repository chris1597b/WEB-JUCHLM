let posts = [];

function parseBody(req) {
    return new Promise((resolve, reject) => {
        if (!req.body) {
            resolve({});
            return;
        }

        if (typeof req.body === "object") {
            resolve(req.body);
            return;
        }

        try {
            resolve(JSON.parse(req.body));
        } catch (error) {
            reject(error);
        }
    });
}

export default async function handler(req, res) {
    const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;

    if (req.method === "GET") {
        const mode = req.query?.["hub.mode"];
        const token = req.query?.["hub.verify_token"];
        const challenge = req.query?.["hub.challenge"];

        if (mode && token) {
            if (mode === "subscribe" && token === VERIFY_TOKEN) {
                console.log("✅ Webhook verificado correctamente");
                res.status(200).send(challenge);
            } else {
                res.status(403).send("Token inválido");
            }
        } else {
            res.status(200).json(posts);
        }
    } else if (req.method === "POST") {
        try {
            const body = await parseBody(req);
            const entries = body?.entry || [];

            entries.forEach((entry) => {
                const changes = entry?.changes || [];

                changes.forEach((change) => {
                    const value = change?.value || {};

                    if (change?.field === "feed" && value?.verb === "add") {
                        const post = {
                            id: value?.post_id || `${Date.now()}`,
                            message: value?.message || "",
                            author: value?.from?.name || "Página",
                            created: value?.created_time || Math.floor(Date.now() / 1000)
                        };

                        posts.unshift(post);
                        posts = posts.slice(0, 20);
                        console.log("📢 Nuevo post guardado:", post);
                    }
                });
            });

            res.status(200).send("EVENT_RECEIVED");
        } catch (error) {
            console.error("Error al procesar el evento", error);
            res.status(400).send("Error al procesar el evento");
        }
    } else {
        res.status(404).send("Not found");
    }
}
