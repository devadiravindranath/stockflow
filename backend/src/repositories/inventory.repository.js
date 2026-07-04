const db = require('../config/database');

class InventoryRepository {
  create(transactionData) {
    const { product_id, quantity, type, reference, notes, performed_by } = transactionData;
    const stmt = db.prepare(`
      INSERT INTO inventory (product_id, quantity, type, reference, notes, performed_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(product_id, quantity, type, reference || null, notes || null, performed_by);
    return this.findById(info.lastInsertRowid);
  }

  findById(id) {
    const stmt = db.prepare(`
      SELECT i.*, p.name as product_name, u.name as user_name
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      LEFT JOIN users u ON i.performed_by = u.id
      WHERE i.id = ?
    `);
    return stmt.get(id);
  }

  findByProductId(productId) {
    const stmt = db.prepare(`
      SELECT i.*, p.name as product_name, u.name as user_name
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      LEFT JOIN users u ON i.performed_by = u.id
      WHERE i.product_id = ?
      ORDER BY i.created_at DESC
    `);
    return stmt.all(productId);
  }

  findAllByOrganization(organizationId) {
    const stmt = db.prepare(`
      SELECT i.*, p.name as product_name, p.sku as product_sku, u.name as user_name
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      LEFT JOIN users u ON i.performed_by = u.id
      WHERE p.organization_id = ?
      ORDER BY i.created_at DESC
    `);
    return stmt.all(organizationId);
  }

  getCurrentStock(productId) {
    const stmt = db.prepare(`
      SELECT COALESCE(SUM(
        CASE 
          WHEN type = 'stock_in' THEN quantity 
          WHEN type = 'stock_out' THEN -quantity 
          WHEN type = 'adjustment' THEN quantity 
          ELSE 0 
        END
      ), 0) as current_stock
      FROM inventory
      WHERE product_id = ?
    `);
    return stmt.get(productId).current_stock;
  }
}

module.exports = new InventoryRepository();
