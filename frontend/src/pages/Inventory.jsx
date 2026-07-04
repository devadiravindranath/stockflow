import React, { useEffect, useState } from 'react';
import Table from '../components/ui/Table';
import Card from '../components/ui/Card';
import inventoryService from '../services/inventory.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Inventory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await inventoryService.getAll();
        setTransactions(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { header: 'Date', accessor: 'created_at', className: 'text-slate-500', render: (row) => new Date(row.created_at).toLocaleString() },
    { header: 'Product', accessor: 'product_name' },
    { header: 'Type', accessor: 'type' },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Reference', accessor: 'reference' },
    { header: 'Performed By', accessor: 'user_name' },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Inventory Transactions</h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-danger-600">{error}</p>}
      {!loading && !error && (
        <Table columns={columns} data={transactions} />
      )}
    </Card>
  );
};

export default Inventory;
