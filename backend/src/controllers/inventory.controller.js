const inventoryService = require('../services/inventory.service');
const ApiError = require('../utils/ApiError');

module.exports = {
  // GET /api/inventory
  async getAll(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const transactions = await inventoryService.getAll(organizationId);
      res.json({ success: true, data: transactions });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/inventory/:id
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const transaction = inventoryService.getById(id);
      if (!transaction) {
        return next(new ApiError(404, 'Inventory transaction not found'));
      }
      res.json({ success: true, data: transaction });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/inventory
  async create(req, res, next) {
    try {
      const transaction = await inventoryService.create(req.body, req.user);
      res.status(201).json({ success: true, data: transaction });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/inventory/:id
  async update(req, res, next) {
    return next(new ApiError(501, 'Update inventory transaction not implemented'));
  },

  // DELETE /api/inventory/:id
  async remove(req, res, next) {
    return next(new ApiError(501, 'Delete inventory transaction not implemented'));
  },
};
