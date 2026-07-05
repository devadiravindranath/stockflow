const db = require('../config/database');

/**
 * Initialize database schema by creating initial tables if they do not exist.
 */
function initDatabase() {
  // Create organizations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      organization_id INTEGER,
      role TEXT NOT NULL DEFAULT 'owner',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
    );
  `);

  // Create products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT NOT NULL,
      description TEXT,
      price REAL DEFAULT 0,
      cost_price REAL DEFAULT 0,
      low_stock_threshold INTEGER,
      quantity_on_hand INTEGER DEFAULT 0,
      organization_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      UNIQUE(sku, organization_id)
    );
  `);

  // Migration: add quantity_on_hand column if it does not exist (for existing databases)
  try {
    db.exec(`ALTER TABLE products ADD COLUMN quantity_on_hand INTEGER DEFAULT 0;`);
    console.log('[Database] Migrated products: added quantity_on_hand column');
  } catch (e) {
    // Column already exists – ignore the "duplicate column name" error
    if (!e.message.includes('duplicate column name')) {
      console.error('Unexpected migration error:', e);
    }
  }

  // Create inventory table (transactions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      type TEXT NOT NULL, -- 'stock_in', 'stock_out', 'adjustment'
      reference TEXT,
      notes TEXT,
      performed_by INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // Create settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      organization_id INTEGER PRIMARY KEY,
      default_low_stock_threshold INTEGER DEFAULT 5,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    );
  `);

  console.log('[Database] Schema initialized successfully.');
}

module.exports = {
  initDatabase,
};
