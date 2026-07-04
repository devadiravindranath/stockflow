const settingsRepository = require('../repositories/settings.repository');

class SettingsService {
  async getSettings(organizationId) {
    return settingsRepository.getSettings(organizationId);
  }

  async updateSettings(organizationId, settingsData) {
    return settingsRepository.updateSettings(organizationId, settingsData);
  }
}

module.exports = new SettingsService();
