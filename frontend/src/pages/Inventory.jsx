import React, { useEffect, useState } from 'react';
import Table from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';
import inventoryService from '../services/inventory.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageHeader from '../components/layout/PageHeader';

const Inventory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      header: 'Transaction Type', 
      accessor: 'type',
      render: (row) => {
        const isAdd = row.type === 'Initial Stock' || row.type === 'Stock Increased' || row.type === 'stock_in';
        const isSub = row.type === 'Stock Decreased' || row.type === 'stock_out';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isAdd ? 'bg-success-100 text-success-800' : 
            isSub ? 'bg-danger-100 text-danger-800' : 
            'bg-warning-100 text-warning-800'
          }`}>
            {row.type}
          </span>
        );
      }
    },
    { 
      header: 'Quantity', 
      accessor: 'quantity',
      render: (row) => {
        const isAdd = row.type === 'Initial Stock' || row.type === 'Stock Increased' || row.type === 'stock_in';
        const isSub = row.type === 'Stock Decreased' || row.type === 'stock_out';
        const prefix = isAdd ? '+' : (isSub ? '-' : '');
        const colorClass = isAdd ? 'text-success-700 font-semibold' : (isSub ? 'text-danger-700 font-semibold' : 'text-slate-700');
        return (
          <span className={colorClass}>
            {prefix}{row.quantity}
          </span>
        );
      }
    },
    { header: 'Note', accessor: 'notes', className: 'text-slate-500' },
  ];

  return (
    <div>
      <PageHeader 
        title="Inventory Transactions" 
        description="View stock movement history across your organization."
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="mb-6 p-4 bg-danger-50 text-danger-700 rounded-lg">
          {error}
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Create or edit products in the catalog to record stock activity history."
        />
      ) : (
        <Table columns={columns} data={transactions} />
      )}
    </div>
  );
};

export default Inventory;
