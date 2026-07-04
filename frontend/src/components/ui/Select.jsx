import React from 'react';

const Select = ({ id, label, name, options, value, onChange, error, required = false, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-slate-700 mb-1">
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      <select
        id={id || name}
        name={name || id}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors sm:text-sm bg-white ${
          error ? 'border-danger-300' : 'border-slate-300'
        }`}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
    </div>
  );
};

export default Select;
