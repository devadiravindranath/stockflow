import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import settingsService from '../services/settings.service';

const Settings = () => {
  const [threshold, setThreshold] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsService.getSettings();
        setThreshold(response.data.data.defaultLowStockThreshold.toString());
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setSaving(true);

    try {
      const thresholdNum = Number(threshold);
      if (!Number.isInteger(thresholdNum) || thresholdNum < 0) {
        throw new Error('Default Low Stock Threshold must be a non-negative integer.');
      }

      await settingsService.updateSettings({
        defaultLowStockThreshold: thresholdNum,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

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
        title="Settings"
        description="Manage your organization settings."
      />

      <div className="max-w-2xl mt-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-3 bg-danger-50 border-l-4 border-danger-500 text-danger-700 text-sm rounded-r">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-success-50 border-l-4 border-success-500 text-success-700 text-sm rounded-r">
                Settings saved successfully.
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Inventory Settings
              </h3>
              
              <Input
                id="defaultLowStockThreshold"
                label="Default Low Stock Threshold"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 5"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                required
              />
              <p className="text-sm text-slate-500 mt-1">
                Used if a product does not have its own low stock threshold specified.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
