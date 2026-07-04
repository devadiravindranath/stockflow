import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ProductForm from '../components/forms/ProductForm';
import productService from '../services/product.service';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response.data.data);
    } catch (err) {
      setError(err.response?.status === 404 ? 'Product not found.' : 'Failed to load product.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleEditSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setFormError('');
      await productService.updateProduct(id, formData);
      setIsEditOpen(false);
      await fetchProduct();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await productService.deleteProduct(id);
      navigate('/products');
    } catch (err) {
      setDeleteLoading(false);
      setIsDeleteOpen(false);
      setError(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Button variant="ghost" onClick={() => navigate('/products')} className="mb-6">
          ← Back to Products
        </Button>
        <div className="p-4 bg-danger-50 text-danger-700 rounded-lg">{error}</div>
      </div>
    );
  }

  const stockLevel = product?.current_stock ?? 0;
  let stockBadge = 'success';
  if (stockLevel === 0) stockBadge = 'danger';
  else if (stockLevel < 10) stockBadge = 'warning';

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>

        <PageHeader
          title={product.name}
          description={`SKU: ${product.sku}`}
          actions={
            <>
              <Button variant="secondary" onClick={() => { setFormError(''); setIsEditOpen(true); }}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
                Delete
              </Button>
            </>
          }
        />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Info Card */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Product Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">Name</dt>
                <dd className="mt-1 text-sm text-slate-900">{product.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">SKU</dt>
                <dd className="mt-1 text-sm text-slate-900 font-mono">{product.sku}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Price</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Date Added</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {new Date(product.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </dd>
              </div>
              {product.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-slate-500">Description</dt>
                  <dd className="mt-1 text-sm text-slate-900">{product.description}</dd>
                </div>
              )}
            </dl>
          </Card>
        </div>

        {/* Stock Summary Card */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Stock Level</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-slate-900">{stockLevel}</p>
                <p className="text-sm text-slate-500 mt-1">units in stock</p>
              </div>
              <Badge variant={stockBadge} className="text-sm px-3 py-1">
                {stockLevel === 0 ? 'Out of Stock' : stockLevel < 10 ? 'Low Stock' : 'In Stock'}
              </Badge>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">Total Value</p>
              <p className="text-lg font-semibold text-slate-900">
                ${(product.price * Math.max(0, stockLevel)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Product">
        {formError && (
          <div className="mb-4 p-3 bg-danger-50 border-l-4 border-danger-500 text-danger-700 text-sm rounded-r">
            {formError}
          </div>
        )}
        <ProductForm
          initialData={product}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditOpen(false)}
          isLoading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Product" size="sm">
        <div className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete <span className="font-semibold text-slate-900">"{product.name}"</span>?
          This will also remove all associated inventory records. This action cannot be undone.
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setIsDeleteOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete Product'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;
