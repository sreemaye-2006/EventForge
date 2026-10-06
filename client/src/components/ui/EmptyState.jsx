import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertCircle, Plus } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Calendar,
  title = 'No items found',
  description = 'There are currently no items available in this section.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div className="bg-white border border-secondary-200 rounded-2xl p-10 text-center max-w-lg mx-auto my-8 shadow-sm">
      <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600 text-sm mb-6 leading-relaxed">{description}</p>
      
      {actionLink && actionText && (
        <Link to={actionLink}>
          <Button variant="primary" className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {actionText}
          </Button>
        </Link>
      )}

      {onAction && actionText && !actionLink && (
        <Button variant="primary" onClick={onAction} className="inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const ErrorAlert = ({
  message = 'An unexpected error occurred while loading data.',
  onRetry
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto my-6">
      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
      <h4 className="text-base font-semibold text-red-900 mb-1">Unable to Load Data</h4>
      <p className="text-red-700 text-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="bg-white border-red-200 text-red-700 hover:bg-red-100">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
