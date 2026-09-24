import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  helpText,
  id,
  className = '', 
  ...props 
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`
          block w-full rounded-md border-secondary-300 shadow-sm
          focus:border-primary-500 focus:ring-primary-500 sm:text-sm
          ${error ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}
          disabled:cursor-not-allowed disabled:bg-secondary-50 disabled:text-secondary-500
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-secondary-500">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
