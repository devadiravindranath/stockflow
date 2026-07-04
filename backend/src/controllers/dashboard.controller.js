const dashboardService = require('../services/dashboard.service');

class DashboardController {
  async getDashboardStats(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      
      if (!organizationId) {
        return res.status(403).json({
          success: false,
          message: 'User does not belong to an organization'
        });
      }

      const stats = await dashboardService.getDashboardStats(organizationId);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
