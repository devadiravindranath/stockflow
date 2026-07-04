import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const EMPTY_FORM = {
  name: '',
  sku: '',
  description: '',
  price: '',
  cost_price: '',
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
        cost_price: initialData.cost_price?.toString() || '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Product name cannot exceed 100 characters';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    } else if (formData.sku.trim().length > 50) {
      newErrors.sku = 'SKU cannot exceed 50 characters';
    } else if (!/^[A-Za-z0-9\-_]+$/.test(formData.sku.trim())) {
      newErrors.sku = 'Only letters, numbers, hyphens, and underscores allowed';
    }

    if (formData.price !== '') {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum)) {
        newErrors.price = 'Price must be a valid number';
      } else if (priceNum < 0) {
        newErrors.price = 'Price cannot be negative';
      } else if (priceNum > 1_000_000) {
        newErrors.price = 'Price cannot exceed $1,000,000';
      }
    }

    if (formData.cost_price !== '') {
      const costNum = parseFloat(formData.cost_price);
      if (isNaN(costNum)) {
        newErrors.cost_price = 'Cost Price must be a valid number';
      } else if (costNum < 0) {
        newErrors.cost_price = 'Cost Price cannot be negative';
      } else if (costNum > 1_000_000) {
        newErrors.cost_price = 'Cost Price cannot exceed $1,000,000';
      }
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
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
      cost_price: formData.cost_price !== '' ? parseFloat(formData.cost_price) : 0,
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
        maxLength={100}
        required
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          id="sku"
          label="SKU"
          placeholder="e.g. HEADPH-001"
          value={formData.sku}
          onChange={handleChange}
          error={errors.sku}
          maxLength={50}
          required
        />
        <Input
          id="cost_price"
          label="Cost Price ($)"
          type="number"
          placeholder="0.00"
          min="0"
          max="1000000"
          step="0.01"
          value={formData.cost_price}
          onChange={handleChange}
          error={errors.cost_price}
        />
        <Input
          id="price"
          label="Selling Price ($)"
          type="number"
          placeholder="0.00"
          min="0"
          max="1000000"
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
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors sm:text-sm placeholder-slate-400 text-slate-900 resize-none ${
            errors.description ? 'border-danger-300' : 'border-slate-300'
          }`}
          placeholder="Optional product description..."
          value={formData.description}
          onChange={handleChange}
          maxLength={500}
        />
        <div className="flex justify-between mt-1">
          {errors.description ? (
            <p className="text-sm text-danger-600">{errors.description}</p>
          ) : <span />}
          <p className="text-xs text-slate-400">{formData.description.length}/500</p>
        </div>
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
