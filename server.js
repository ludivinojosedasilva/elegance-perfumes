// server.js
const express = require('express');
const setupDatabase = require('./database.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

async function main() {
    const db = await setupDatabase();

    // Rota para buscar produtos com paginação
    // Ex: /api/products?limit=3&offset=0 (busca os 3 primeiros)
    // Ex: /api/products?limit=3&offset=3 (busca os próximos 3)
    app.get('/api/products', async (req, res) => {
        const limit = parseInt(req.query.limit) || 3; // Padrão de 3 produtos por vez
        const offset = parseInt(req.query.offset) || 0;

        try {
            const products = await db.all("SELECT * FROM products LIMIT ? OFFSET ?", [limit, offset]);
            const total = await db.get("SELECT COUNT(id) as count FROM products");
            // Enviamos os produtos e o total para o front-end saber se há mais para carregar
            res.json({ products, total: total.count });
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar produtos." });
        }
    });

    app.post('/api/contact', async (req, res) => {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Nome, email e mensagem são obrigatórios.' });
        }
        try {
            await db.run("INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)", name, email, subject, message);
            res.status(201).json({ message: 'Mensagem recebida com sucesso! Obrigado pelo contato.' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao salvar a mensagem.' });
        }
    });

    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
}

main();