const db = require('../config/database');

class SettingsRepository {
  getSettings(organizationId) {
    const stmt = db.prepare('SELECT default_low_stock_threshold as defaultLowStockThreshold FROM settings WHERE organization_id = ?');
    let settings = stmt.get(organizationId);

    // If no settings exist yet, return defaults
    if (!settings) {
      settings = { defaultLowStockThreshold: 5 };
      this.createSettings(organizationId, settings);
    }
    
    return settings;
  }

  createSettings(organizationId, settings) {
    const stmt = db.prepare('INSERT INTO settings (organization_id, default_low_stock_threshold) VALUES (?, ?)');
    stmt.run(organizationId, settings.defaultLowStockThreshold);
  }

  updateSettings(organizationId, settings) {
    const stmt = db.prepare('UPDATE settings SET default_low_stock_threshold = ? WHERE organization_id = ?');
    const result = stmt.run(settings.defaultLowStockThreshold, organizationId);
    
    // Fallback if record didn't exist
    if (result.changes === 0) {
      this.createSettings(organizationId, settings);
    }
    
    return this.getSettings(organizationId);
  }
}

module.exports = new SettingsRepository();
