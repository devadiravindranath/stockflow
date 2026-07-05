const inventoryRepository = require('../repositories/inventory.repository');
const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/ApiError');

class InventoryService {
  // Get all inventory transactions for the user's organization
  async getAll(organizationId) {
    if (!organizationId) {
      throw new ApiError(400, 'Organization ID is required');
    }
    return inventoryRepository.findAllByOrganization(organizationId);
  }

  // Get a single transaction by its ID (no org check needed as ID is unique)
  async getById(id) {
    const transaction = inventoryRepository.findById(id);
    if (!transaction) {
      throw new ApiError(404, 'Inventory transaction not found');
    }
    return transaction;
  }

  // Create a new transaction with business rule enforcement
  async create(data, performedByUser) {
    const { product_id, quantity, type, reference, notes } = data;
    const organizationId = performedByUser.organization_id;

    // Verify product belongs to the same organization
    const product = productRepository.findById(product_id, organizationId);
    if (!product) {
      throw new ApiError(404, 'Product not found in your organization');
    }

    // Ensure quantity is a positive number (type validation handled elsewhere)
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      throw new ApiError(400, 'Quantity must be a positive number');
    }

    // Use product.quantity_on_hand as the source of truth
    const currentQty = product.quantity_on_hand || 0;
    let newQty;

    if (type === 'stock_in') {
      newQty = currentQty + qty;
    } else if (type === 'stock_out') {
      newQty = currentQty - qty;
      if (newQty < 0) {
        throw new ApiError(400, 'Insufficient stock for this operation');
      }
    } else if (type === 'adjustment') {
      // For adjustment, quantity can represent a delta (positive or negative)
      // The validator allows positive qty; we add it as-is
      newQty = currentQty + qty;
      if (newQty < 0) {
        throw new ApiError(400, 'Adjustment would result in negative stock');
      }
    } else {
      throw new ApiError(400, `Invalid transaction type: ${type}`);
    }

    // Persist transaction
    const transaction = inventoryRepository.create({
      product_id,
      quantity: qty,
      type,
      reference: reference || null,
      notes: notes || null,
      performed_by: performedByUser.id,
    });

    // Update the product's quantity_on_hand
    productRepository.updateQuantity(product_id, organizationId, newQty);

    return transaction;
  }
}

module.exports = new InventoryService();
