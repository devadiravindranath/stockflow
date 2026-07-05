const db = require('../config/database');
const settingsRepository = require('../repositories/settings.repository');

class DashboardService {
  async getDashboardStats(organizationId) {
    // Fetch org settings for default threshold
    const settings = settingsRepository.getSettings(organizationId);
    const defaultThreshold = settings ? settings.defaultLowStockThreshold : 5;

    // Get all products for this organization
    const productsStmt = db.prepare('SELECT price, low_stock_threshold, quantity_on_hand FROM products WHERE organization_id = ?');
    const products = productsStmt.all(organizationId);

    const totalProducts = products.length;

    // Total Quantity: sum of quantity_on_hand across all products
    const totalQuantity = products.reduce((sum, p) => sum + (p.quantity_on_hand || 0), 0);

    // Calculate total stock value (price * quantity_on_hand)
    const totalStockValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity_on_hand || 0)), 0);

    // Low stock count (dynamic threshold per product or fallback to org default)
    const lowStockCount = products.filter(p => {
      const threshold = p.low_stock_threshold !== null && p.low_stock_threshold !== undefined
        ? p.low_stock_threshold
        : defaultThreshold;
      return (p.quantity_on_hand || 0) <= threshold;
    }).length;

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
      totalQuantity,
      totalStockValue,
      lowStockCount,
      recentActivity
    };
  }
}

module.exports = new DashboardService();
