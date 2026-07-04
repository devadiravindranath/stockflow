const settingsService = require('../services/settings.service');

class SettingsController {
  async getSettings(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const settings = await settingsService.getSettings(organizationId);
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const settings = await settingsService.updateSettings(organizationId, req.body);
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingsController();
