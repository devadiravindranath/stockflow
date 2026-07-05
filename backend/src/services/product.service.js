const productRepository = require('../repositories/product.repository');
const inventoryRepository = require('../repositories/inventory.repository');
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

  async createProduct(productData, organizationId, userId) {
    // Check if SKU is already in use for this organization
    const existing = productRepository.findBySku(productData.sku, organizationId);
    if (existing) {
      throw new ApiError(409, `Product with SKU '${productData.sku}' already exists`);
    }

    const newProduct = {
      ...productData,
      organization_id: organizationId
    };

    const createdProduct = productRepository.create(newProduct);

    // Create Initial Stock transaction
    try {
      inventoryRepository.create({
        product_id: createdProduct.id,
        quantity: createdProduct.quantity_on_hand || 0,
        type: 'Initial Stock',
        reference: null,
        notes: 'Product Created',
        performed_by: userId
      });
    } catch (err) {
      console.error('[ProductService] Failed to record initial stock transaction:', err);
    }

    return createdProduct;
  }

  async updateProduct(id, productData, organizationId, userId) {
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

    const updatedProduct = productRepository.update(id, organizationId, { ...product, ...productData });

    // Calculate difference and create transaction if quantity changed
    const oldQty = product.quantity_on_hand || 0;
    const newQty = updatedProduct.quantity_on_hand || 0;
    const diff = newQty - oldQty;

    if (diff !== 0) {
      try {
        inventoryRepository.create({
          product_id: id,
          quantity: Math.abs(diff),
          type: diff > 0 ? 'Stock Increased' : 'Stock Decreased',
          reference: null,
          notes: 'Product Quantity Updated',
          performed_by: userId
        });
      } catch (err) {
        console.error('[ProductService] Failed to record product update transaction:', err);
      }
    }

    return updatedProduct;
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
