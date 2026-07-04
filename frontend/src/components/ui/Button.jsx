import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  fullWidth = false, 
  disabled = false,
  onClick,
  className = ''
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm px-5 py-2.5";
  
  const variants = {
    primary: "text-white bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 shadow-sm",
    secondary: "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 focus:ring-brand-500",
    danger: "text-white bg-danger-600 hover:bg-danger-700 focus:ring-danger-500 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
