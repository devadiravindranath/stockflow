import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const EMPTY_FORM = {
  name: '',
  sku: '',
  description: '',
  price: '',
};

const ProductForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.price !== '' && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    }
    if (formData.price !== '' && parseFloat(formData.price) < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      description: formData.description.trim(),
      price: formData.price !== '' ? parseFloat(formData.price) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="Product Name"
        placeholder="e.g. Blue Wireless Headphones"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="sku"
          label="SKU"
          placeholder="e.g. HEADPH-001"
          value={formData.sku}
          onChange={handleChange}
          error={errors.sku}
          required
        />
        <Input
          id="price"
          label="Price ($)"
          type="number"
          placeholder="0.00"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
        />
      </div>

      <div className="w-full">
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors sm:text-sm placeholder-slate-400 text-slate-900 resize-none"
          placeholder="Optional product description..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (initialData ? 'Update Product' : 'Add Product')}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
