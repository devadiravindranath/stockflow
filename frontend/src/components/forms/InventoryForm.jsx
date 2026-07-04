import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import inventoryService from '../../services/inventory.service';
import productService from '../../services/product.service';

// Fetch product options for the select field
const fetchProductOptions = async () => {
  const res = await productService.getAll();
  const products = res.data.data || [];
  return products.map(p => ({ value: p.id, label: `${p.name} (${p.sku})` }));
};

const InventoryForm = ({ onClose, onSuccess, initialData = {} }) => {
  const [formData, setFormData] = useState({
    product_id: initialData.product_id || '',
    type: initialData.type || 'stock_in',
    quantity: initialData.quantity || '',
    reference: initialData.reference || '',
    notes: initialData.notes || '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProductOptions().then(setProducts);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await inventoryService.create(formData);
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create transaction';
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add Inventory Transaction" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          name="product_id"
          label="Product"
          options={products}
          value={formData.product_id}
          onChange={handleChange}
          required
        />
        <Select
          name="type"
          label="Type"
          options={[{ value: 'stock_in', label: 'Stock In' }, { value: 'stock_out', label: 'Stock Out' }, { value: 'adjustment', label: 'Adjustment' }]}
          value={formData.type}
          onChange={handleChange}
          required
        />
        <Input
          name="quantity"
          label="Quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <Input
          name="reference"
          label="Reference"
          placeholder="Optional reference"
          value={formData.reference}
          onChange={handleChange}
        />
        <textarea
          name="notes"
          placeholder="Optional notes"
          className="w-full p-2 border rounded"
          value={formData.notes}
          rows={3}
          onChange={handleChange}
        />
        {errors.submit && <p className="text-danger-600">{errors.submit}</p>}
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>Add</Button>
        </div>
      </form>
    </Modal>
  );
};

export default InventoryForm;
