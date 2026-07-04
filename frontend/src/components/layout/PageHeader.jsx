import React from 'react';

const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
