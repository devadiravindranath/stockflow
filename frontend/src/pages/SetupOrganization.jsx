import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import organizationService from '../services/organization.service';
import { useAuth } from '../hooks/useAuth';

const SetupOrganization = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setOrganization } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Organization name is required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await organizationService.createOrganization(name);
      
      // Update auth context with the new organization
      if (setOrganization) {
        setOrganization(response.data.data);
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Create your workspace
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Let's set up your organization to start managing inventory.
          </p>
        </div>

        <div className="glass-panel shadow-glass sm:rounded-2xl px-4 py-8 sm:px-10 border border-slate-200/50">
          {error && (
            <div className="mb-4 p-3 bg-danger-50 border-l-4 border-danger-500 text-danger-700 text-sm rounded-r">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="name"
              label="Organization Name"
              placeholder="e.g. Acme Corp"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              required
            />

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Continue to Dashboard'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupOrganization;
