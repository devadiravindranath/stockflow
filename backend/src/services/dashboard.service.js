const db = require('../config/database');

class DashboardService {
  async getDashboardStats(organizationId) {
    // 1. Total products
    const productsStmt = db.prepare('SELECT COUNT(*) as count FROM products WHERE organization_id = ?');
    const totalProducts = productsStmt.get(organizationId).count;

    // 2. Current Stock Levels (Calculate current quantity by summing inventory transactions)
    // We can join products and inventory to find current stock per product, and then calculate total value and low stock
    const stockStmt = db.prepare(`
      SELECT 
        p.id, p.name, p.price,
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
    `);
    
    const productsStock = stockStmt.all(organizationId);
    
    // Calculate total stock value (price * current_stock)
    const totalStockValue = productsStock.reduce((acc, p) => acc + (p.price * Math.max(0, p.current_stock)), 0);
    
    // Low stock count (assuming < 10 is low stock for MVP, normally this would be a per-product setting)
    const lowStockCount = productsStock.filter(p => p.current_stock < 10).length;

    // 3. Recent activity (last 5 inventory movements)
    const activityStmt = db.prepare(`
      SELECT 
        i.id, i.quantity, i.type, i.created_at,
        p.name as product_name,
        u.name as user_name
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      LEFT JOIN users u ON i.performed_by = u.id
      WHERE p.organization_id = ?
      ORDER BY i.created_at DESC
      LIMIT 5
    `);
    const recentActivity = activityStmt.all(organizationId);

    return {
      totalProducts,
      totalStockValue,
      lowStockCount,
      recentActivity
    };
  }
}

module.exports = new DashboardService();
