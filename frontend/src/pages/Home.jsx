import React from 'react';

function Home() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to StockFlow MVP</h1>
      <p>A SaaS Inventory Management System</p>
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', display: 'inline-block' }}>
        <h3>Project Status: Initial Setup</h3>
        <p>Frontend scaffolded successfully with React, Vite, and React Router.</p>
      </div>
    </div>
  );
}

export default Home;
