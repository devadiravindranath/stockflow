import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import SetupOrganization from './pages/SetupOrganization';

import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          
          {/* Protected Routes - No Org Required */}
          <Route element={<ProtectedRoute requireOrg={false} />}>
            <Route path="/setup-organization" element={<SetupOrganization />} />
          </Route>

          {/* Protected Routes - Org Required */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Dashboard placeholder until Task 17 */}
              <Route path="/dashboard" element={<div className="p-8">Dashboard Overview (Protected)</div>} />
              
              {/* Future placeholders for sidebar links */}
              <Route path="/products" element={<div className="p-8">Products (Protected)</div>} />
              <Route path="/inventory" element={<div className="p-8">Inventory (Protected)</div>} />
              <Route path="/settings" element={<div className="p-8">Settings (Protected)</div>} />
            </Route>
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
