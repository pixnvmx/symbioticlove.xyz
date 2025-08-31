const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database setup
const db = new sqlite3.Database('guestbook.db');

// Create messages table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        xHandle TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Routes
app.get('/api/messages', (req, res) => {
    db.all('SELECT * FROM messages ORDER BY timestamp DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/messages', (req, res) => {
    const { xHandle, message } = req.body;
    
    if (!xHandle || !message) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    
    // Check if user already has a message
    db.get('SELECT * FROM messages WHERE LOWER(xHandle) = LOWER(?)', [xHandle], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (row) {
            res.status(400).json({ error: 'User already has a message' });
            return;
        }
        
        // Insert new message
        db.run('INSERT INTO messages (xHandle, message) VALUES (?, ?)', [xHandle, message], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            res.json({ 
                id: this.lastID,
                xHandle,
                message,
                timestamp: new Date().toISOString()
            });
        });
    });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/guestbook', (req, res) => {
    res.sendFile(path.join(__dirname, 'guestbook.html'));
});

app.get('/secret', (req, res) => {
    res.sendFile(path.join(__dirname, 'secret.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to see your site`);
});
