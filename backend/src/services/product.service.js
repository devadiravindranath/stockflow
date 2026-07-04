const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/ApiError');

class ProductService {
  async getAllProducts(organizationId) {
    if (!organizationId) throw new ApiError(400, 'Organization ID is required');
    return productRepository.findAll(organizationId);
  }

  async getProductById(id, organizationId) {
    const product = productRepository.findById(id, organizationId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async createProduct(productData, organizationId) {
    // Check if SKU is already in use for this organization
    const existing = productRepository.findBySku(productData.sku, organizationId);
    if (existing) {
      throw new ApiError(409, `Product with SKU '${productData.sku}' already exists`);
    }

    const newProduct = {
      ...productData,
      organization_id: organizationId
    };

    return productRepository.create(newProduct);
  }

  async updateProduct(id, productData, organizationId) {
    const product = productRepository.findById(id, organizationId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // If changing SKU, check for duplicates
    if (productData.sku && productData.sku !== product.sku) {
      const existing = productRepository.findBySku(productData.sku, organizationId);
      if (existing) {
        throw new ApiError(409, `Product with SKU '${productData.sku}' already exists`);
      }
    }

    return productRepository.update(id, organizationId, { ...product, ...productData });
  }

  async deleteProduct(id, organizationId) {
    const product = productRepository.findById(id, organizationId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    
    // SQLite ON DELETE CASCADE will handle inventory deletion if configured,
    // otherwise manual deletion from inventory would be required.
    // The schema in models/database.js has ON DELETE CASCADE for inventory.
    productRepository.delete(id, organizationId);
    return { success: true };
  }
}

module.exports = new ProductService();
