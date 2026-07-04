const productService = require('../services/product.service');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const products = await productService.getAllProducts(organizationId);
      
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const { id } = req.params;
      
      const product = await productService.getProductById(id, organizationId);
      
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const product = await productService.createProduct(req.body, organizationId);
      
      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const { id } = req.params;
      
      const product = await productService.updateProduct(id, req.body, organizationId);
      
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const { id } = req.params;
      
      await productService.deleteProduct(id, organizationId);
      
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
