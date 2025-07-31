// database.js
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function setup() {
    // Abre a conexão com o banco de dados. O arquivo perfumes.db será criado.
    const db = await open({
        filename: './perfumes.db',
        driver: sqlite3.Database
    });

    // Cria a tabela de produtos se ela não existir
    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL,
            imageUrl TEXT
        );
    `);

    // Cria a tabela de contatos se ela não existir
    await db.exec(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            subject TEXT,
            message TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Verifica se já existem produtos para não inserir de novo
    const count = await db.get("SELECT COUNT(id) as count FROM products");
    if (count.count === 0) {
        // Insere os produtos na tabela
        await db.run("INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)", "Noir Elegance", "Uma fragrância amadeirada com notas de sândalo, baunilha e pimenta rosa.", 299.90, "https://placehold.co/600x800/EDF2F4/2B2D42?text=ELEGANCE+Noir");
        await db.run("INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)", "Fleur Royale", "Notas florais de jasmim, rosa e peônia com acabamento baunilhado.", 329.90, "https://placehold.co/600x800/EDF2F4/2B2D42?text=ELEGANCE+Fleur");
        await db.run("INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)", "Citrus Sublime", "Combinação refrescante de bergamota, limão siciliano e vetiver.", 279.90, "https://placehold.co/600x800/EDF2F4/2B2D42?text=ELEGANCE+Citrus");
        await db.run("INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)", "Royal Oud", "Oud raro combinado com âmbar e notas especiadas para uma fragrância sofisticada.", 399.90, "https://placehold.co/600x800/EDF2F4/2B2D42?text=ELEGANCE+Oud");
        await db.run("INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)", "Vanille Velours", "Baunilha de Madagascar com nuances de caramelo e madeira de cedro.", 289.90, "https://placehold.co/600x800/EDF2F4/2B2D42?text=ELEGANCE+Vanille");
        await db.run("INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)", "Ocean Breeze", "Aroma marinho com notas de algas, sal marinho e cardamomo.", 269.90, "https://placehold.co/600x800/EDF2F4/2B2D42?text=ELEGANCE+Ocean");
        console.log('Banco de dados populado com sucesso!');
    }

    return db;
}

module.exports = setup;