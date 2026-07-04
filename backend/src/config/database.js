const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'stockflow.db');

// Establish database connection
const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null,
});

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

console.log(`[Database] SQLite connected successfully at: ${dbPath}`);

module.exports = db;
