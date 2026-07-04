import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ProductForm from '../components/forms/ProductForm';
import productService from '../services/product.service';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data.data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormError('');
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setFormError('');
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
      } else {
        await productService.createProduct(formData);
      }
      closeModal();
      setLoading(true);
      await fetchProducts();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Product Info',
      accessor: 'name',
      render: (product) => (
        <div>
          <div className="font-medium text-slate-900">{product.name}</div>
          <div className="text-slate-500 text-xs">SKU: {product.sku}</div>
        </div>
      )
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (product) => `$${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      header: 'Current Stock',
      accessor: 'current_stock',
      render: (product) => {
        const stock = product.current_stock;
        let badgeVariant = 'success';
        if (stock === 0) badgeVariant = 'danger';
        else if (stock < 10) badgeVariant = 'warning';

        return (
          <Badge variant={badgeVariant}>
            {stock} units
          </Badge>
        );
      }
    },
    {
      header: 'Added',
      accessor: 'created_at',
      render: (product) => new Date(product.created_at).toLocaleDateString()
    },
    {
      header: '',
      accessor: 'actions',
      render: (product) => (
        <button
          onClick={(e) => { e.stopPropagation(); openEditModal(product); }}
          className="text-brand-600 hover:text-brand-800 font-medium text-sm"
        >
          Edit
        </button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog and view current stock levels."
        actions={
          <Button onClick={openCreateModal}>
            Add Product
          </Button>
        }
      />

      {error && (
        <div className="mb-6 p-4 bg-danger-50 text-danger-700 rounded-lg">
          {error}
        </div>
      )}

      {!error && products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Get started by adding your first product to the catalog."
          actionLabel="Add Product"
          onAction={openCreateModal}
        />
      ) : (
        <>
          {/* Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:max-w-xs">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredProducts}
            onRowClick={(product) => navigate(`/products/${product.id}`)}
          />

          {filteredProducts.length === 0 && searchQuery && (
            <div className="text-center py-12 text-slate-500">
              No products found matching "{searchQuery}"
            </div>
          )}
        </>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        {formError && (
          <div className="mb-4 p-3 bg-danger-50 border-l-4 border-danger-500 text-danger-700 text-sm rounded-r">
            {formError}
          </div>
        )}
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          isLoading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Products;
