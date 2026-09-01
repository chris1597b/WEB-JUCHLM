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
    const VERIFY_TOKEN = "1763808028406723|-kGpcxBIJUk-1_oqVI6xjbnEKSA";

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

// Using global fetch (Node.js 18+)


const PAGE_ID = "1212920221907909";
const ACCESS_TOKEN = "EAAZAELI78M8MBRxqzs7gA9mlGuyzNj2EKJ8g9Mi6j4fVm9GODFcu62HjClH0PAHqpZAqXl8EWZC5s3I4fVstn49OgJFlVlruEt7CR0q5Ce0lxsqZBGwjnjc6ZCvGdyX1104g1kxFo8ZByVNaOXaYl6U4zZAjwlujr2bV7UKaUEZAtcuSPMWHoRvI03nUzVtlcZAZAsI4D4yepX9m6WiaK0NmbQZAd5YOldeAlmdpDRlHTQ31Xr8MwTNssZAQEzUZD"; // tu Page Access Token

async function getFacebookPosts() {
    const url = `https://graph.facebook.com/${PAGE_ID}/posts?fields=id,message,created_time,from,permalink_url&access_token=${ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.data) {
        console.error("Error al obtener posts:", data);
        return [];
    }

    return data.data.map(post => ({
        id: post.id,
        message: post.message || "(sin mensaje)",
        author: post.from?.name || "Página",
        created: new Date(post.created_time).toLocaleString(),
        link: post.permalink_url
    }));
}

// Ejemplo de uso
getFacebookPosts().then(posts => {
    console.log("Posts de la página:", posts);
}).catch(err => {
    console.warn("No se pudieron obtener los posts de Facebook en la carga inicial:", err.message);
});
