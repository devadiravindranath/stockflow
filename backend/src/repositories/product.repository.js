const db = require('../config/database');

class ProductRepository {
  create(productData) {
    const { name, sku, description, price, organization_id } = productData;
    const stmt = db.prepare(`
      INSERT INTO products (name, sku, description, price, organization_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, sku, description, price || 0, organization_id);
    return this.findById(info.lastInsertRowid, organization_id);
  }

  findById(id, organizationId) {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ? AND organization_id = ?');
    return stmt.get(id, organizationId);
  }

  findBySku(sku, organizationId) {
    const stmt = db.prepare('SELECT * FROM products WHERE sku = ? AND organization_id = ?');
    return stmt.get(sku, organizationId);
  }

  findAll(organizationId) {
    // Optionally include current stock
    const stmt = db.prepare(`
      SELECT p.*, 
        COALESCE(SUM(
          CASE 
            WHEN i.type = 'stock_in' THEN i.quantity 
            WHEN i.type = 'stock_out' THEN -i.quantity 
            WHEN i.type = 'adjustment' THEN i.quantity 
            ELSE 0 
          END
        ), 0) as current_stock
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.organization_id = ?
      GROUP BY p.id
      ORDER BY p.name ASC
    `);
    return stmt.all(organizationId);
  }

  update(id, organizationId, updateData) {
    const { name, sku, description, price } = updateData;
    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, sku = ?, description = ?, price = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND organization_id = ?
    `);
    stmt.run(name, sku, description, price, id, organizationId);
    return this.findById(id, organizationId);
  }

  delete(id, organizationId) {
    const stmt = db.prepare('DELETE FROM products WHERE id = ? AND organization_id = ?');
    stmt.run(id, organizationId);
  }
}

module.exports = new ProductRepository();
