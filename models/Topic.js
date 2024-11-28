const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Usa una ruta absoluta para la base de datos
const dbPath = path.join(__dirname, '../database/votos.db');
console.log('Database path:', dbPath); // Para verificar la ruta

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

function initDatabase() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            votes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table "topics" created or already exists');
        }
    });
}

class Topic {
    static getAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM topics ORDER BY votes DESC', [], (err, rows) => {
                if (err) {
                    console.error('Error getting topics:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM topics WHERE id = ?', [id], (err, row) => {
                if (err) {
                    console.error('Error getting topic:', err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    static create(title) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO topics (title, votes) VALUES (?, 0)', [title], function(err) {
                if (err) {
                    console.error('Error creating topic:', err);
                    reject(err);
                } else {
                    console.log('Created topic with ID:', this.lastID);
                    resolve(this.lastID);
                }
            });
        });
    }

    static update(id, title) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE topics SET title = ? WHERE id = ?', [title, id], (err) => {
                if (err) {
                    console.error('Error updating topic:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM topics WHERE id = ?', [id], (err) => {
                if (err) {
                    console.error('Error deleting topic:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static vote(id) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE topics SET votes = votes + 1 WHERE id = ?', [id], (err) => {
                if (err) {
                    console.error('Error voting for topic:', err);
                    reject(err);
                } else {
                    this.getById(id)
                        .then(topic => resolve(topic))
                        .catch(err => reject(err));
                }
            });
        });
    }
}

module.exports = Topic;
