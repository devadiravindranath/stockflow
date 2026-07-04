const organizationService = require('../services/organization.service');

class OrganizationController {
  async createOrganization(req, res, next) {
    try {
      const { name } = req.body;
      const userId = req.user.id;
      
      const organization = await organizationService.createOrganization(name, userId);
      
      res.status(201).json({
        success: true,
        data: organization
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyOrganization(req, res, next) {
    try {
      const userId = req.user.id;
      const organization = await organizationService.getMyOrganization(userId);
      
      res.status(200).json({
        success: true,
        data: organization
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrganizationController();
