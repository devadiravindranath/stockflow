import React, { useEffect, useState } from 'react';
import Table from '../components/ui/Table';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import inventoryService from '../services/inventory.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import InventoryForm from '../components/forms/InventoryForm';
import PageHeader from '../components/layout/PageHeader';

const Inventory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getAll();
      setTransactions(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { header: 'Date', accessor: 'created_at', className: 'text-slate-500', render: (row) => new Date(row.created_at).toLocaleString() },
    { header: 'Product', accessor: 'product_name', cellClassName: 'font-medium text-slate-900' },
    { 
      header: 'Type', 
      accessor: 'type',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.type === 'stock_in' ? 'bg-success-100 text-success-800' : 
          row.type === 'stock_out' ? 'bg-danger-100 text-danger-800' : 
          'bg-warning-100 text-warning-800'
        }`}>
          {row.type.replace('_', ' ')}
        </span>
      )
    },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Reference', accessor: 'reference', className: 'text-slate-500' },
    { header: 'Performed By', accessor: 'user_name', className: 'text-slate-500' },
  ];

  return (
    <div>
      <PageHeader 
        title="Inventory Transactions" 
        description="View and manage stock movements across your organization."
        actions={
          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            Add Transaction
          </Button>
        }
      />

      <Card className="p-6">
        {loading && transactions.length === 0 ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-danger-600">{error}</p>
        ) : (
          <Table columns={columns} data={transactions} />
        )}
      </Card>

      {isFormOpen && (
        <InventoryForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchData(); // reload transactions after success
          }} 
        />
      )}
    </div>
  );
};

export default Inventory;
