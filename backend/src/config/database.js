const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Resolve DB path: prefer DB_STORAGE env var (Render persistent disk),
// fall back to local data directory for development.
const dbPath = process.env.DB_STORAGE || path.join(dataDir, 'stockflow.db');

// Establish database connection
const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null,
});

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

console.log(`[Database] SQLite connected successfully at: ${dbPath}`);

module.exports = db;
